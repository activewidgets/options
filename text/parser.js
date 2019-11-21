/* @license
Papa Parse
v5.1.0
https://github.com/mholt/PapaParse
License: MIT
*/


    var Papa = {};

    Papa.RECORD_SEP = String.fromCharCode(30);
    Papa.UNIT_SEP = String.fromCharCode(31);
    Papa.BYTE_ORDER_MARK = '\ufeff';
    Papa.BAD_DELIMITERS = ['\r', '\n', '"', Papa.BYTE_ORDER_MARK];
    Papa.DefaultDelimiter = ',';            // Used if not specified and detection fails


    function guessLineEndings(input, quoteChar)
    {
        input = input.substring(0, 1024 * 1024);    // max length 1 MB
        // Replace all the text inside quotes
        var re = new RegExp(escapeRegExp(quoteChar) + '([^]*?)' + escapeRegExp(quoteChar), 'gm');
        input = input.replace(re, '');

        var r = input.split('\r');

        var n = input.split('\n');

        var nAppearsFirst = (n.length > 1 && n[0].length < r[0].length);

        if (r.length === 1 || nAppearsFirst)
            return '\n';

        var numWithN = 0;
        for (var i = 0; i < r.length; i++)
        {
            if (r[i][0] === '\n')
                numWithN++;
        }

        return numWithN >= r.length / 2 ? '\r\n' : '\r';
    }


    /** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions */
    function escapeRegExp(string)
    {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    /** The core parser implements speedy and correct CSV parsing */
    function Parser(config)
    {
        // Unpack the config object
        config = config || {};
        var delim = config.delimiter;
        var newline = config.newline;
        var comments = config.comments;
        var step = config.step;
        var preview = config.preview;
        var fastMode = config.fastMode;
        var quoteChar;
        /** Allows for no quoteChar by setting quoteChar to undefined in config */
        if (config.quoteChar === undefined) {
            quoteChar = '"';
        } else {
            quoteChar = config.quoteChar;
        }
        var escapeChar = quoteChar;
        if (config.escapeChar !== undefined) {
            escapeChar = config.escapeChar;
        }

        // Delimiter must be valid
        if (typeof delim !== 'string'
            || Papa.BAD_DELIMITERS.indexOf(delim) > -1)
            delim = ',';

        // Comment character must be valid
        if (comments === delim)
            throw new Error('Comment character same as delimiter');
        else if (comments === true)
            comments = '#';
        else if (typeof comments !== 'string'
            || Papa.BAD_DELIMITERS.indexOf(comments) > -1)
            comments = false;

        // Newline must be valid: \r, \n, or \r\n
        if (newline !== '\n' && newline !== '\r' && newline !== '\r\n')
            newline = '\n';

        // We're gonna need these at the Parser scope
        var cursor = 0;
        var aborted = false;

        this.parse = function(input, baseIndex, ignoreLastRow)
        {
            // For some reason, in Chrome, this speeds things up (!?)
            if (typeof input !== 'string')
                throw new Error('Input must be a string');

            // We don't need to compute some of these every time parse() is called,
            // but having them in a more local scope seems to perform better
            var inputLen = input.length,
                delimLen = delim.length,
                newlineLen = newline.length,
                commentsLen = comments.length;
            var stepIsFunction = isFunction(step);

            // Establish starting state
            cursor = 0;
            var data = [], errors = [], row = [], lastCursor = 0;

            if (!input)
                return returnable();

            if (fastMode || (fastMode !== false && input.indexOf(quoteChar) === -1))
            {
                var rows = input.split(newline);
                for (var i = 0; i < rows.length; i++)
                {
                    row = rows[i];
                    cursor += row.length;
                    if (i !== rows.length - 1)
                        cursor += newline.length;
                    else if (ignoreLastRow)
                        return returnable();
                    if (comments && row.substring(0, commentsLen) === comments)
                        continue;
                    if (stepIsFunction)
                    {
                        data = [];
                        pushRow(row.split(delim));
                        doStep();
                        if (aborted)
                            return returnable();
                    }
                    else
                        pushRow(row.split(delim));
                    if (preview && i >= preview)
                    {
                        data = data.slice(0, preview);
                        return returnable(true);
                    }
                }
                return returnable();
            }

            var nextDelim = input.indexOf(delim, cursor);
            var nextNewline = input.indexOf(newline, cursor);
            var quoteCharRegex = new RegExp(escapeRegExp(escapeChar) + escapeRegExp(quoteChar), 'g');
            var quoteSearch = input.indexOf(quoteChar, cursor);

            // Parser loop
            for (;;)
            {
                // Field has opening quote
                if (input[cursor] === quoteChar)
                {
                    // Start our search for the closing quote where the cursor is
                    quoteSearch = cursor;

                    // Skip the opening quote
                    cursor++;

                    for (;;)
                    {
                        // Find closing quote
                        quoteSearch = input.indexOf(quoteChar, quoteSearch + 1);

                        //No other quotes are found - no other delimiters
                        if (quoteSearch === -1)
                        {
                            if (!ignoreLastRow) {
                                // No closing quote... what a pity
                                errors.push({
                                    type: 'Quotes',
                                    code: 'MissingQuotes',
                                    message: 'Quoted field unterminated',
                                    row: data.length,   // row has yet to be inserted
                                    index: cursor
                                });
                            }
                            return finish();
                        }

                        // Closing quote at EOF
                        if (quoteSearch === inputLen - 1)
                        {
                            var value = input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar);
                            return finish(value);
                        }

                        // If this quote is escaped, it's part of the data; skip it
                        // If the quote character is the escape character, then check if the next character is the escape character
                        if (quoteChar === escapeChar &&  input[quoteSearch + 1] === escapeChar)
                        {
                            quoteSearch++;
                            continue;
                        }

                        // If the quote character is not the escape character, then check if the previous character was the escape character
                        if (quoteChar !== escapeChar && quoteSearch !== 0 && input[quoteSearch - 1] === escapeChar)
                        {
                            continue;
                        }

                        if(nextDelim !== -1 && nextDelim < (quoteSearch + 1)) {
                            nextDelim = input.indexOf(delim, (quoteSearch + 1));
                        }
                        if(nextNewline !== -1 && nextNewline < (quoteSearch + 1)) {
                            nextNewline = input.indexOf(newline, (quoteSearch + 1));
                        }
                        // Check up to nextDelim or nextNewline, whichever is closest
                        var checkUpTo = nextNewline === -1 ? nextDelim : Math.min(nextDelim, nextNewline);
                        var spacesBetweenQuoteAndDelimiter = extraSpaces(checkUpTo);

                        // Closing quote followed by delimiter or 'unnecessary spaces + delimiter'
                        if (input[quoteSearch + 1 + spacesBetweenQuoteAndDelimiter] === delim)
                        {
                            row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
                            cursor = quoteSearch + 1 + spacesBetweenQuoteAndDelimiter + delimLen;

                            // If char after following delimiter is not quoteChar, we find next quote char position
                            if (input[quoteSearch + 1 + spacesBetweenQuoteAndDelimiter + delimLen] !== quoteChar)
                            {
                                quoteSearch = input.indexOf(quoteChar, cursor);
                            }
                            nextDelim = input.indexOf(delim, cursor);
                            nextNewline = input.indexOf(newline, cursor);
                            break;
                        }

                        var spacesBetweenQuoteAndNewLine = extraSpaces(nextNewline);

                        // Closing quote followed by newline or 'unnecessary spaces + newLine'
                        if (input.substring(quoteSearch + 1 + spacesBetweenQuoteAndNewLine, quoteSearch + 1 + spacesBetweenQuoteAndNewLine + newlineLen) === newline)
                        {
                            row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
                            saveRow(quoteSearch + 1 + spacesBetweenQuoteAndNewLine + newlineLen);
                            nextDelim = input.indexOf(delim, cursor);   // because we may have skipped the nextDelim in the quoted field
                            quoteSearch = input.indexOf(quoteChar, cursor); // we search for first quote in next line

                            if (stepIsFunction)
                            {
                                doStep();
                                if (aborted)
                                    return returnable();
                            }

                            if (preview && data.length >= preview)
                                return returnable(true);

                            break;
                        }


                        // Checks for valid closing quotes are complete (escaped quotes or quote followed by EOF/delimiter/newline) -- assume these quotes are part of an invalid text string
                        errors.push({
                            type: 'Quotes',
                            code: 'InvalidQuotes',
                            message: 'Trailing quote on quoted field is malformed',
                            row: data.length,   // row has yet to be inserted
                            index: cursor
                        });

                        quoteSearch++;
                        continue;

                    }

                    continue;
                }

                // Comment found at start of new line
                if (comments && row.length === 0 && input.substring(cursor, cursor + commentsLen) === comments)
                {
                    if (nextNewline === -1) // Comment ends at EOF
                        return returnable();
                    cursor = nextNewline + newlineLen;
                    nextNewline = input.indexOf(newline, cursor);
                    nextDelim = input.indexOf(delim, cursor);
                    continue;
                }

                // Next delimiter comes before next newline, so we've reached end of field
                if (nextDelim !== -1 && (nextDelim < nextNewline || nextNewline === -1))
                {
                    // we check, if we have quotes, because delimiter char may be part of field enclosed in quotes
                    if (quoteSearch > nextDelim) {
                        // we have quotes, so we try to find the next delimiter not enclosed in quotes and also next starting quote char
                        var nextDelimObj = getNextUnquotedDelimiter(nextDelim, quoteSearch, nextNewline);

                        // if we have next delimiter char which is not enclosed in quotes
                        if (nextDelimObj && typeof nextDelimObj.nextDelim !== 'undefined') {
                            nextDelim = nextDelimObj.nextDelim;
                            quoteSearch = nextDelimObj.quoteSearch;
                            row.push(input.substring(cursor, nextDelim));
                            cursor = nextDelim + delimLen;
                            // we look for next delimiter char
                            nextDelim = input.indexOf(delim, cursor);
                            continue;
                        }
                    } else {
                        row.push(input.substring(cursor, nextDelim));
                        cursor = nextDelim + delimLen;
                        nextDelim = input.indexOf(delim, cursor);
                        continue;
                    }
                }

                // End of row
                if (nextNewline !== -1)
                {
                    row.push(input.substring(cursor, nextNewline));
                    saveRow(nextNewline + newlineLen);

                    if (stepIsFunction)
                    {
                        doStep();
                        if (aborted)
                            return returnable();
                    }

                    if (preview && data.length >= preview)
                        return returnable(true);

                    continue;
                }

                break;
            }


            return finish();


            function pushRow(row)
            {
                data.push(row);
                lastCursor = cursor;
            }

            /**
             * checks if there are extra spaces after closing quote and given index without any text
             * if Yes, returns the number of spaces
             */
            function extraSpaces(index) {
                var spaceLength = 0;
                if (index !== -1) {
                    var textBetweenClosingQuoteAndIndex = input.substring(quoteSearch + 1, index);
                    if (textBetweenClosingQuoteAndIndex && textBetweenClosingQuoteAndIndex.trim() === '') {
                        spaceLength = textBetweenClosingQuoteAndIndex.length;
                    }
                }
                return spaceLength;
            }

            /**
             * Appends the remaining input from cursor to the end into
             * row, saves the row, calls step, and returns the results.
             */
            function finish(value)
            {
                if (ignoreLastRow)
                    return returnable();
                if (typeof value === 'undefined')
                    value = input.substring(cursor);
                row.push(value);
                cursor = inputLen;  // important in case parsing is paused
                pushRow(row);
                if (stepIsFunction)
                    doStep();
                return returnable();
            }

            /**
             * Appends the current row to the results. It sets the cursor
             * to newCursor and finds the nextNewline. The caller should
             * take care to execute user's step function and check for
             * preview and end parsing if necessary.
             */
            function saveRow(newCursor)
            {
                cursor = newCursor;
                pushRow(row);
                row = [];
                nextNewline = input.indexOf(newline, cursor);
            }

            /** Returns an object with the results, errors, and meta. */
            function returnable(stopped)
            {
                return {
                    data: data,
                    errors: errors,
                    meta: {
                        delimiter: delim,
                        linebreak: newline,
                        aborted: aborted,
                        truncated: !!stopped,
                        cursor: lastCursor + (baseIndex || 0)
                    }
                };
            }

            /** Executes the user's step function and resets data & errors. */
            function doStep()
            {
                step(returnable());
                data = [];
                errors = [];
            }

            /** Gets the delimiter character, which is not inside the quoted field */
            function getNextUnquotedDelimiter(nextDelim, quoteSearch, newLine) {
                var result = {
                    nextDelim: undefined,
                    quoteSearch: undefined
                };
                // get the next closing quote character
                var nextQuoteSearch = input.indexOf(quoteChar, quoteSearch + 1);

                // if next delimiter is part of a field enclosed in quotes
                if (nextDelim > quoteSearch && nextDelim < nextQuoteSearch && (nextQuoteSearch < newLine || newLine === -1)) {
                    // get the next delimiter character after this one
                    var nextNextDelim = input.indexOf(delim, nextQuoteSearch);

                    // if there is no next delimiter, return default result
                    if (nextNextDelim === -1) {
                        return result;
                    }
                    // find the next opening quote char position
                    if (nextNextDelim > nextQuoteSearch) {
                        nextQuoteSearch = input.indexOf(quoteChar, nextQuoteSearch + 1);
                    }
                    // try to get the next delimiter position
                    result = getNextUnquotedDelimiter(nextNextDelim, nextQuoteSearch, newLine);
                } else {
                    result = {
                        nextDelim: nextDelim,
                        quoteSearch: quoteSearch
                    };
                }

                return result;
            }
        };

        /** Sets the abort flag */
        this.abort = function()
        {
            aborted = true;
        };

        /** Gets the cursor position */
        this.getCharIndex = function()
        {
            return cursor;
        };
    }


    function isFunction(func)
    {
        return typeof func === 'function';
    }


// ----------------------------------------------------

Parser.guessLineEndings = guessLineEndings;

export default Parser;