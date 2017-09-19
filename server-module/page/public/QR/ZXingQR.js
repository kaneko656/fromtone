// ZXingQR.js
(function() {
    window.RGBLuminanceSource = function(d, W, H) {
        RGBLuminanceSource.initializeBase(this, [W, H]);
        this.$7 = W;
        this.$6 = H;
        var $0 = W;
        var $1 = H;
        this.$2 = new Array($0 * $1);
        for (var $2 = 0; $2 < $1; $2++) {
            var $3 = $2 * $0;
            for (var $4 = 0; $4 < $0; $4++) {
                var $5 = d[$3 * 4 + $4 * 4];
                var $6 = d[$3 * 4 + $4 * 4 + 1];
                var $7 = d[$3 * 4 + $4 * 4 + 2];
                if ($5 === $6 && $6 === $7) {
                    this.$2[$3 + $4] = $5;
                } else {
                    this.$2[$3 + $4] = (($5 + $6 + $6 + $7) >> 2);
                }
            }
        }
    }
    RGBLuminanceSource.prototype = {
        $2: null,
        $3: false,
        $4: false,
        $5: null,
        get_height: function() {
            if (!this.$3) {
                return this.$6;
            } else {
                return this.$7;
            }
        },
        get_width: function() {
            if (!this.$3) {
                return this.$7;
            } else {
                return this.$6;
            }
        },
        $6: 0,
        $7: 0,
        getRow: function(y, row) {
            if (!this.$3) {
                var $0 = this.get_width();
                if (row == null || row.length < $0) {
                    row = new Array($0);
                }
                for (var $1 = 0; $1 < $0; $1++) {
                    row[$1] = this.$2[y * $0 + $1];
                }
                return row;
            } else {
                var $2 = this.$7;
                var $3 = this.$6;
                if (row == null || row.length < $3) {
                    row = new Array($3);
                }
                for (var $4 = 0; $4 < $3; $4++) {
                    row[$4] = this.$2[$4 * $2 + y];
                }
                return row;
            }
        },
        get_matrix: function() {
            return this.$2;
        },
        crop: function(left, top, width, height) {
            return RGBLuminanceSource.callBaseMethod(this, 'crop', [left, top, width, height]);
        },
        rotateCounterClockwise: function() {
            this.$3 = true;
            return this;
        },
        get_rotateSupported: function() {
            return true;
        }
    }
    window.SupportClass = function() {}
    SupportClass.toByteArray1 = function(sbyteArray) {
        var $0 = null;
        if (sbyteArray != null) {
            $0 = new Array(sbyteArray.length);
            for (var $1 = 0; $1 < sbyteArray.length; $1++) {
                $0[$1] = sbyteArray[$1];
            }
        }
        return $0;
    }
    SupportClass.toByteArray2 = function(sourceString) {
        throw new Error('NotImplementedException');
    }
    SupportClass.toByteArray3 = function(tempObjectArray) {
        var $0 = null;
        if (tempObjectArray != null) {
            $0 = new Array(tempObjectArray.length);
            for (var $1 = 0; $1 < tempObjectArray.length; $1++) {
                $0[$1] = tempObjectArray[$1];
            }
        }
        return $0;
    }
    SupportClass.urShift1 = function(number, bits) {
        if (number >= 0) {
            return number >> bits;
        } else {
            return (number >> bits) + (2 << ~bits);
        }
    }
    SupportClass.urShift2 = function(number, bits) {
        return SupportClass.urShift1(number, bits);
    }
    SupportClass.urShift3 = function(number, bits) {
        if (number >= 0) {
            return number >> bits;
        } else {
            return (number >> bits) + (2 << ~bits);
        }
    }
    SupportClass.urShift4 = function(number, bits) {
        return SupportClass.urShift3(number, bits);
    }
    SupportClass.identity1 = function(literal) {
        return literal;
    }
    SupportClass.identity2 = function(literal) {
        return literal;
    }
    SupportClass.identity3 = function(literal) {
        return literal;
    }
    SupportClass.identity4 = function(literal) {
        return literal;
    }
    SupportClass.getCharsFromString = function(sourceString, sourceStart, sourceEnd, destinationArray, destinationStart) {
        var $0;
        var $1;
        $0 = sourceStart;
        $1 = destinationStart;
        while ($0 < sourceEnd) {
            destinationArray[$1] = sourceString.charAt($0);
            $0++;
            $1++;
        }
    }
    SupportClass.setCapacity = function(vector, newCapacity) {
        if (newCapacity > vector.length) {
            vector.addRange(new Array(newCapacity - vector.length));
        } else if (newCapacity < vector.length) {
            vector.removeRange(newCapacity, vector.length - newCapacity);
        }
    }
    SupportClass.toSByteArray = function(byteArray) {
        var $0 = null;
        if (byteArray != null) {
            $0 = new Array(byteArray.length);
            for (var $1 = 0; $1 < byteArray.length; $1++) {
                $0[$1] = byteArray[$1];
            }
        }
        return $0;
    }
    Type.registerNamespace('com.google.zxing.client.result');
    com.google.zxing.client.result.ZXingQR$10 = function() {
        com.google.zxing.client.result.ZXingQR$10.initializeBase(this);
    }
    com.google.zxing.client.result.ZXingQR$10.$8 = function($p0, $p1, $p2) {
        return com.google.zxing.client.result.ResultParser.$5($p0, $p1, ';', $p2);
    }
    com.google.zxing.client.result.ZXingQR$10.$9 = function($p0, $p1, $p2) {
        return com.google.zxing.client.result.ResultParser.$6($p0, $p1, ';', $p2);
    }
    com.google.zxing.client.result.ZXingQR$11 = function() {
        com.google.zxing.client.result.ZXingQR$11.initializeBase(this);
    }
    com.google.zxing.client.result.ZXingQR$11.$8 = function($p0) {
        var $0 = $p0.get_text();
        if ($0 == null || $0.indexOf('MEMORY') < 0 || $0.indexOf('\r\n') < 0) {
            return null;
        }
        var $1 = com.google.zxing.client.result.ResultParser.$6('NAME1:', $0, '\r', true);
        var $2 = com.google.zxing.client.result.ResultParser.$6('NAME2:', $0, '\r', true);
        var $3 = com.google.zxing.client.result.ZXingQR$11.$9('TEL', 3, $0, true);
        var $4 = com.google.zxing.client.result.ZXingQR$11.$9('MAIL', 3, $0, true);
        var $5 = com.google.zxing.client.result.ResultParser.$6('MEMORY:', $0, '\r', false);
        var $6 = com.google.zxing.client.result.ResultParser.$6('ADD:', $0, '\r', true);
        var $7 = ($6 == null) ? null : [$6];
        return new com.google.zxing.client.result.AddressBookParsedResult(com.google.zxing.client.result.ResultParser.maybeWrap($1), $2, $3, $4, $5, $7, null, null, null, null);
    }
    com.google.zxing.client.result.ZXingQR$11.$9 = function($p0, $p1, $p2, $p3) {
        var $0 = null;
        for (var $1 = 1; $1 <= $p1; $1++) {
            var $2 = com.google.zxing.client.result.ResultParser.$6($p0 + $1 + ':', $p2, '\r', $p3);
            if ($2 == null) {
                break;
            }
            if ($0 == null) {
                $0 = [];
            }
            $0.add($2);
        }
        if ($0 == null) {
            return null;
        }
        return com.google.zxing.client.result.ResultParser.$7($0);
    }
    com.google.zxing.client.result.ZXingQR$1F = function() {
        com.google.zxing.client.result.ZXingQR$1F.initializeBase(this);
    }
    com.google.zxing.client.result.ZXingQR$1F.$A = function($p0) {
        var $0 = $p0.get_text();
        if ($0 == null || !$0.startsWith('MECARD:')) {
            return null;
        }
        var $1 = com.google.zxing.client.result.ZXingQR$10.$8('N:', $0, true);
        if ($1 == null) {
            return null;
        }
        var $2 = com.google.zxing.client.result.ZXingQR$1F.$B($1[0]);
        var $3 = com.google.zxing.client.result.ZXingQR$10.$9('SOUND:', $0, true);
        var $4 = com.google.zxing.client.result.ZXingQR$10.$8('TEL:', $0, true);
        var $5 = com.google.zxing.client.result.ZXingQR$10.$8('EMAIL:', $0, true);
        var $6 = com.google.zxing.client.result.ZXingQR$10.$9('NOTE:', $0, false);
        var $7 = com.google.zxing.client.result.ZXingQR$10.$8('ADR:', $0, true);
        var $8 = com.google.zxing.client.result.ZXingQR$10.$9('BDAY:', $0, true);
        if ($8 != null && !com.google.zxing.client.result.ResultParser.isStringOfDigits($8, 8)) {
            $8 = null;
        }
        var $9 = com.google.zxing.client.result.ZXingQR$10.$9('URL:', $0, true);
        var $A = com.google.zxing.client.result.ZXingQR$10.$9('ORG:', $0, true);
        return new com.google.zxing.client.result.AddressBookParsedResult(com.google.zxing.client.result.ResultParser.maybeWrap($2), $3, $4, $5, $6, $7, $A, $8, null, $9);
    }
    com.google.zxing.client.result.ZXingQR$1F.$B = function($p0) {
        var $0 = $p0.indexOf(',');
        if ($0 >= 0) {
            return $p0.substr($0 + 1) + ' ' + $p0.substr(0, $0 - (0));
        }
        return $p0;
    }
    com.google.zxing.client.result.AddressBookParsedResult = function(names, pronunciation, phoneNumbers, emails, note, addresses, org, birthday, title, url) {
        com.google.zxing.client.result.AddressBookParsedResult.initializeBase(this, [com.google.zxing.client.result.ParsedResultType.ADDRESSBOOK]);
        this.$1 = names;
        this.$2 = pronunciation;
        this.$3 = phoneNumbers;
        this.$4 = emails;
        this.$5 = note;
        this.$6 = addresses;
        this.$7 = org;
        this.$8 = birthday;
        this.$9 = title;
        this.$A = url;
    }
    com.google.zxing.client.result.AddressBookParsedResult.prototype = {
        get_names: function() {
            return this.$1;
        },
        get_pronunciation: function() {
            return this.$2;
        },
        get_phoneNumbers: function() {
            return this.$3;
        },
        get_emails: function() {
            return this.$4;
        },
        get_note: function() {
            return this.$5;
        },
        get_addresses: function() {
            return this.$6;
        },
        get_title: function() {
            return this.$9;
        },
        get_org: function() {
            return this.$7;
        },
        get_URL: function() {
            return this.$A;
        },
        get_birthday: function() {
            return this.$8;
        },
        get_displayResult: function() {
            var $0 = new ss.StringBuilder();
            com.google.zxing.client.result.ParsedResult.maybeAppend2(this.$1, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$2, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$9, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$7, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend2(this.$6, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend2(this.$3, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend2(this.$4, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$A, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$8, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$5, $0);
            return $0.toString();
        },
        $1: null,
        $2: null,
        $3: null,
        $4: null,
        $5: null,
        $6: null,
        $7: null,
        $8: null,
        $9: null,
        $A: null
    }
    com.google.zxing.client.result.ZXingQR$1E = function() {
        com.google.zxing.client.result.ZXingQR$1E.initializeBase(this);
    }
    com.google.zxing.client.result.ZXingQR$1E.$A = function($p0) {
        var $0 = $p0.get_text();
        if ($0 == null || !$0.startsWith('BIZCARD:')) {
            return null;
        }
        var $1 = com.google.zxing.client.result.ZXingQR$10.$9('N:', $0, true);
        var $2 = com.google.zxing.client.result.ZXingQR$10.$9('X:', $0, true);
        var $3 = com.google.zxing.client.result.ZXingQR$1E.$C($1, $2);
        var $4 = com.google.zxing.client.result.ZXingQR$10.$9('T:', $0, true);
        var $5 = com.google.zxing.client.result.ZXingQR$10.$9('C:', $0, true);
        var $6 = com.google.zxing.client.result.ZXingQR$10.$8('A:', $0, true);
        var $7 = com.google.zxing.client.result.ZXingQR$10.$9('B:', $0, true);
        var $8 = com.google.zxing.client.result.ZXingQR$10.$9('M:', $0, true);
        var $9 = com.google.zxing.client.result.ZXingQR$10.$9('F:', $0, true);
        var $A = com.google.zxing.client.result.ZXingQR$10.$9('E:', $0, true);
        return new com.google.zxing.client.result.AddressBookParsedResult(com.google.zxing.client.result.ResultParser.maybeWrap($3), null, com.google.zxing.client.result.ZXingQR$1E.$B($7, $8, $9), com.google.zxing.client.result.ResultParser.maybeWrap($A), null, $6, $5, null, $4, null);
    }
    com.google.zxing.client.result.ZXingQR$1E.$B = function($p0, $p1, $p2) {
        var $0 = [];
        if ($p0 != null) {
            $0.add($p0);
        }
        if ($p1 != null) {
            $0.add($p1);
        }
        if ($p2 != null) {
            $0.add($p2);
        }
        var $1 = $0.length;
        if (!$1) {
            return null;
        }
        var $2 = new Array($1);
        for (var $3 = 0; $3 < $1; $3++) {
            $2[$3] = ($0[$3]);
        }
        return $2;
    }
    com.google.zxing.client.result.ZXingQR$1E.$C = function($p0, $p1) {
        if ($p0 == null) {
            return $p1;
        } else {
            return ($p1 == null) ? $p0 : $p0 + ' ' + $p1;
        }
    }
    com.google.zxing.client.result.ZXingQR$20 = function() {
        com.google.zxing.client.result.ZXingQR$20.initializeBase(this);
    }
    com.google.zxing.client.result.ZXingQR$20.$A = function($p0) {
        var $0 = $p0.get_text();
        if ($0 == null || !$0.startsWith('MEBKM:')) {
            return null;
        }
        var $1 = com.google.zxing.client.result.ZXingQR$10.$9('TITLE:', $0, true);
        var $2 = com.google.zxing.client.result.ZXingQR$10.$8('URL:', $0, true);
        if ($2 == null) {
            return null;
        }
        var $3 = $2[0];
        if (!com.google.zxing.client.result.ZXingQR$D.$9($3)) {
            return null;
        }
        return new com.google.zxing.client.result.URIParsedResult($3, $1);
    }
    com.google.zxing.client.result.CalendarParsedResult = function(summary, start, end, location, attendee, title) {
        com.google.zxing.client.result.CalendarParsedResult.initializeBase(this, [com.google.zxing.client.result.ParsedResultType.CALENDAR]);
        if (start == null) {
            throw new Error('ArgumentException');
        }
        com.google.zxing.client.result.CalendarParsedResult.$7(start);
        com.google.zxing.client.result.CalendarParsedResult.$7(end);
        this.$1 = summary;
        this.$2 = start;
        this.$3 = end;
        this.$4 = location;
        this.$5 = attendee;
        this.$6 = title;
    }
    com.google.zxing.client.result.CalendarParsedResult.$7 = function($p0) {
        if ($p0 != null) {
            var $0 = $p0.length;
            if ($0 !== 8 && $0 !== 15 && $0 !== 16) {
                throw new Error('ArgumentException');
            }
            for (var $1 = 0; $1 < 8; $1++) {
                if (!SystemExtend.CharExtend.isDigit($p0.charAt($1))) {
                    throw new Error('ArgumentException');
                }
            }
            if ($0 > 8) {
                if ($p0.charAt(8) !== 'T') {
                    throw new Error('ArgumentException');
                }
                for (var $2 = 9; $2 < 15; $2++) {
                    if (!SystemExtend.CharExtend.isDigit($p0.charAt($2))) {
                        throw new Error('ArgumentException');
                    }
                }
                if ($0 === 16 && $p0.charAt(15) !== 'Z') {
                    throw new Error('ArgumentException');
                }
            }
        }
    }
    com.google.zxing.client.result.CalendarParsedResult.prototype = {
        get_summary: function() {
            return this.$1;
        },
        get_start: function() {
            return this.$2;
        },
        get_end: function() {
            return this.$3;
        },
        get_location: function() {
            return this.$4;
        },
        get_attendee: function() {
            return this.$5;
        },
        get_title: function() {
            return this.$6;
        },
        get_displayResult: function() {
            var $0 = new ss.StringBuilder();
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$1, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$2, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$3, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$4, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$5, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$6, $0);
            return $0.toString();
        },
        $1: null,
        $2: null,
        $3: null,
        $4: null,
        $5: null,
        $6: null
    }
    com.google.zxing.client.result.EmailAddressParsedResult = function(emailAddress, subject, body, mailtoURI) {
        com.google.zxing.client.result.EmailAddressParsedResult.initializeBase(this, [com.google.zxing.client.result.ParsedResultType.emaiL_ADDRESS]);
        this.$1 = emailAddress;
        this.$2 = subject;
        this.$3 = body;
        this.$4 = mailtoURI;
    }
    com.google.zxing.client.result.EmailAddressParsedResult.prototype = {
        get_emailAddress: function() {
            return this.$1;
        },
        get_subject: function() {
            return this.$2;
        },
        get_body: function() {
            return this.$3;
        },
        get_mailtoURI: function() {
            return this.$4;
        },
        get_displayResult: function() {
            var $0 = new ss.StringBuilder();
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$1, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$2, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$3, $0);
            return $0.toString();
        },
        $1: null,
        $2: null,
        $3: null,
        $4: null
    }
    com.google.zxing.client.result.ZXingQR$13 = function() {
        com.google.zxing.client.result.ZXingQR$13.initializeBase(this);
    }
    com.google.zxing.client.result.ZXingQR$13.$8 = function($p0) {
        var $0 = $p0.get_text();
        if ($0 == null) {
            return null;
        }
        var $1;
        if ($0.startsWith('mailto:') || $0.startsWith('MAILTO:')) {
            $1 = $0.substr(7);
            var $2 = $1.indexOf('?');
            if ($2 >= 0) {
                $1 = $1.substr(0, $2 - (0));
            }
            var $3 = com.google.zxing.client.result.ResultParser.$3($0);
            var $4 = null;
            var $5 = null;
            if ($3 != null) {
                if (!$1.length) {
                    $1 = $3['to'];
                }
                $4 = $3['subject'];
                $5 = $3['body'];
            }
            return new com.google.zxing.client.result.EmailAddressParsedResult($1, $4, $5, $0);
        } else {
            if (!com.google.zxing.client.result.ZXingQR$22.$C($0)) {
                return null;
            }
            $1 = $0;
            return new com.google.zxing.client.result.EmailAddressParsedResult($1, null, null, 'mailto:' + $1);
        }
    }
    com.google.zxing.client.result.ZXingQR$22 = function() {
        com.google.zxing.client.result.ZXingQR$22.initializeBase(this);
    }
    com.google.zxing.client.result.ZXingQR$22.$B = function($p0) {
        var $0 = $p0.get_text();
        if ($0 == null || !$0.startsWith('MATMSG:')) {
            return null;
        }
        var $1 = com.google.zxing.client.result.ZXingQR$10.$8('TO:', $0, true);
        if ($1 == null) {
            return null;
        }
        var $2 = $1[0];
        if (!com.google.zxing.client.result.ZXingQR$22.$C($2)) {
            return null;
        }
        var $3 = com.google.zxing.client.result.ZXingQR$10.$9('SUB:', $0, false);
        var $4 = com.google.zxing.client.result.ZXingQR$10.$9('BODY:', $0, false);
        return new com.google.zxing.client.result.EmailAddressParsedResult($2, $3, $4, 'mailto:' + $2);
    }
    com.google.zxing.client.result.ZXingQR$22.$C = function($p0) {
        if ($p0 == null) {
            return false;
        }
        var $0 = false;
        for (var $1 = 0; $1 < $p0.length; $1++) {
            var $2 = $p0.charAt($1);
            if ((SystemExtend.CharExtend.toInt32($2) < SystemExtend.CharExtend.toInt32('a') || SystemExtend.CharExtend.toInt32($2) > SystemExtend.CharExtend.toInt32('z')) && (SystemExtend.CharExtend.toInt32($2) < SystemExtend.CharExtend.toInt32('A') || SystemExtend.CharExtend.toInt32($2) > SystemExtend.CharExtend.toInt32('Z')) && (SystemExtend.CharExtend.toInt32($2) < SystemExtend.CharExtend.toInt32('0') || SystemExtend.CharExtend.toInt32($2) > SystemExtend.CharExtend.toInt32('9')) && !com.google.zxing.client.result.ZXingQR$22.$D($2)) {
                return false;
            }
            if ($2 === '@') {
                if ($0) {
                    return false;
                }
                $0 = true;
            }
        }
        return $0;
    }
    com.google.zxing.client.result.ZXingQR$22.$D = function($p0) {
        for (var $0 = 0; $0 < com.google.zxing.client.result.ZXingQR$22.$A.length; $0++) {
            if ($p0 === com.google.zxing.client.result.ZXingQR$22.$A[$0]) {
                return true;
            }
        }
        return false;
    }
    com.google.zxing.client.result.GeoParsedResult = function(geoURI, latitude, longitude, altitude) {
        com.google.zxing.client.result.GeoParsedResult.initializeBase(this, [com.google.zxing.client.result.ParsedResultType.GEO]);
        this.$1 = geoURI;
        this.$2 = latitude;
        this.$3 = longitude;
        this.$4 = altitude;
    }
    com.google.zxing.client.result.GeoParsedResult.prototype = {
        get_geoURI: function() {
            return this.$1;
        },
        get_latitude: function() {
            return this.$2;
        },
        get_longitude: function() {
            return this.$3;
        },
        get_altitude: function() {
            return this.$4;
        },
        get_displayResult: function() {
            var $0 = new ss.StringBuilder();
            $0.append(this.$2);
            $0.append(', ');
            $0.append(this.$3);
            if (this.$4 > 0) {
                $0.append(', ');
                $0.append(this.$4);
                $0.append('m');
            }
            return $0.toString();
        },
        $1: null,
        $2: 0,
        $3: 0,
        $4: 0
    }
    com.google.zxing.client.result.ZXingQR$12 = function() {
        com.google.zxing.client.result.ZXingQR$12.initializeBase(this);
    }
    com.google.zxing.client.result.ZXingQR$12.$8 = function($p0) {
        var $0 = $p0.get_text();
        if ($0 == null || (!$0.startsWith('geo:') && !$0.startsWith('GEO:'))) {
            return null;
        }
        var $1 = $0.indexOf('?', 4);
        var $2 = ($1 < 0) ? $0.substr(4) : $0.substr(4, $1 - (4));
        var $3 = $2.indexOf(',');
        if ($3 < 0) {
            return null;
        }
        var $4 = $2.indexOf(',', $3 + 1);
        var $5, $6, $7;
        try {
            $5 = parseFloat($2.substr(0, $3 - (0)));
            if ($4 < 0) {
                $6 = parseFloat($2.substr($3 + 1));
                $7 = 0;
            } else {
                $6 = parseFloat($2.substr($3 + 1, $4 - ($3 + 1)));
                $7 = parseFloat($2.substr($4 + 1));
            }
        } catch ($8) {
            return null;
        }
        return new com.google.zxing.client.result.GeoParsedResult(($0.startsWith('GEO:')) ? 'geo:' + $0.substr(4) : $0, $5, $6, $7);
    }
    com.google.zxing.client.result.ISBNParsedResult = function(isbn) {
        com.google.zxing.client.result.ISBNParsedResult.initializeBase(this, [com.google.zxing.client.result.ParsedResultType.ISBN]);
        this.$1 = isbn;
    }
    com.google.zxing.client.result.ISBNParsedResult.prototype = {
        get_ISBN: function() {
            return this.$1;
        },
        get_displayResult: function() {
            return this.$1;
        },
        $1: null
    }
    com.google.zxing.client.result.ISBNResultParser = function() {
        com.google.zxing.client.result.ISBNResultParser.initializeBase(this);
    }
    com.google.zxing.client.result.ISBNResultParser.parse = function(result) {
        var $0 = result.get_barcodeFormat();
        if (!(com.google.zxing.BarcodeFormat.eaN_13 === $0)) {
            return null;
        }
        var $1 = result.get_text();
        if ($1 == null) {
            return null;
        }
        var $2 = $1.length;
        if ($2 !== 13) {
            return null;
        }
        if (!$1.startsWith('978') && !$1.startsWith('979')) {
            return null;
        }
        return new com.google.zxing.client.result.ISBNParsedResult($1);
    }
    com.google.zxing.client.result.ParsedResult = function(type) {
        this.$0 = type;
    }
    com.google.zxing.client.result.ParsedResult.maybeAppend1 = function(value_Renamed, result) {
        if (value_Renamed != null && value_Renamed.length > 0) {
            if (result.toString().length > 0) {
                result.append('\n');
            }
            result.append(value_Renamed);
        }
    }
    com.google.zxing.client.result.ParsedResult.maybeAppend2 = function(value_Renamed, result) {
        if (value_Renamed != null) {
            for (var $0 = 0; $0 < value_Renamed.length; $0++) {
                if (value_Renamed[$0] != null && value_Renamed[$0].length > 0) {
                    if (result.toString().length > 0) {
                        result.append('\n');
                    }
                    result.append(value_Renamed[$0]);
                }
            }
        }
    }
    com.google.zxing.client.result.ParsedResult.prototype = {
        get_type: function() {
            return this.$0;
        },
        $0: null,
        toString: function() {
            return this.get_displayResult();
        }
    }
    com.google.zxing.client.result.ParsedResultType = function(name) {
        this.$0 = name;
    }
    com.google.zxing.client.result.ParsedResultType.prototype = {
        $0: null,
        toString: function() {
            return this.$0;
        }
    }
    com.google.zxing.client.result.ProductParsedResult = function(productID, normalizedProductID) {
        com.google.zxing.client.result.ProductParsedResult.initializeBase(this, [com.google.zxing.client.result.ParsedResultType.PRODUCT]);
        this.$1 = productID;
        this.$2 = normalizedProductID;
    }
    com.google.zxing.client.result.ProductParsedResult.prototype = {
        get_productID: function() {
            return this.$1;
        },
        get_normalizedProductID: function() {
            return this.$2;
        },
        get_displayResult: function() {
            return this.$1;
        },
        $1: null,
        $2: null
    }
    com.google.zxing.client.result.ZXingQR$C = function() {
        com.google.zxing.client.result.ZXingQR$C.initializeBase(this);
    }
    com.google.zxing.client.result.ZXingQR$C.$8 = function($p0) {
        var $0 = $p0.get_barcodeFormat();
        if (!(com.google.zxing.BarcodeFormat.upC_A === $0 || com.google.zxing.BarcodeFormat.upC_E === $0 || com.google.zxing.BarcodeFormat.eaN_8 === $0 || com.google.zxing.BarcodeFormat.eaN_13 === $0)) {
            return null;
        }
        var $1 = $p0.get_text();
        if ($1 == null) {
            return null;
        }
        var $2 = $1.length;
        for (var $4 = 0; $4 < $2; $4++) {
            var $5 = $1.charAt($4);
            if (SystemExtend.CharExtend.toInt32($5) < SystemExtend.CharExtend.toInt32('0') || SystemExtend.CharExtend.toInt32('c') > SystemExtend.CharExtend.toInt32('9')) {
                return null;
            }
        }
        var $3;
        if (com.google.zxing.BarcodeFormat.upC_E === $0) {
            $3 = com.google.zxing.oned.UPCEReader.convertUPCEtoUPCA($1);
        } else {
            $3 = $1;
        }
        return new com.google.zxing.client.result.ProductParsedResult($1, $3);
    }
    com.google.zxing.client.result.ResultParser = function() {}
    com.google.zxing.client.result.ResultParser.parseResult = function(theResult) {
        var $0;
        if (($0 = com.google.zxing.client.result.ZXingQR$20.$A(theResult)) != null) {
            return $0;
        } else if (($0 = com.google.zxing.client.result.ZXingQR$1F.$A(theResult)) != null) {
            return $0;
        } else if (($0 = com.google.zxing.client.result.ZXingQR$22.$B(theResult)) != null) {
            return $0;
        } else if (($0 = com.google.zxing.client.result.ZXingQR$11.$8(theResult)) != null) {
            return $0;
        } else if (($0 = com.google.zxing.client.result.ZXingQR$E.$8(theResult)) != null) {
            return $0;
        } else if (($0 = com.google.zxing.client.result.ZXingQR$1E.$A(theResult)) != null) {
            return $0;
        } else if (($0 = com.google.zxing.client.result.ZXingQR$1D.$8(theResult)) != null) {
            return $0;
        } else if (($0 = com.google.zxing.client.result.ZXingQR$13.$8(theResult)) != null) {
            return $0;
        } else if (($0 = com.google.zxing.client.result.ZXingQR$F.$8(theResult)) != null) {
            return $0;
        } else if (($0 = com.google.zxing.client.result.ZXingQR$B.$8(theResult)) != null) {
            return $0;
        } else if (($0 = com.google.zxing.client.result.ZXingQR$12.$8(theResult)) != null) {
            return $0;
        } else if (($0 = com.google.zxing.client.result.ZXingQR$A.$0(theResult)) != null) {
            return $0;
        } else if (($0 = com.google.zxing.client.result.ZXingQR$D.$8(theResult)) != null) {
            return $0;
        } else if (($0 = com.google.zxing.client.result.ISBNResultParser.parse(theResult)) != null) {
            return $0;
        } else if (($0 = com.google.zxing.client.result.ZXingQR$C.$8(theResult)) != null) {
            return $0;
        }
        return new com.google.zxing.client.result.TextParsedResult(theResult.get_text(), null);
    }
    com.google.zxing.client.result.ResultParser.maybeAppend1 = function(value_Renamed, result) {
        if (value_Renamed != null) {
            result.append('\n');
            result.append(value_Renamed);
        }
    }
    com.google.zxing.client.result.ResultParser.maybeAppend2 = function(value_Renamed, result) {
        if (value_Renamed != null) {
            for (var $0 = 0; $0 < value_Renamed.length; $0++) {
                result.append('\n');
                result.append(value_Renamed[$0]);
            }
        }
    }
    com.google.zxing.client.result.ResultParser.maybeWrap = function(value_Renamed) {
        return (value_Renamed == null) ? null : [value_Renamed];
    }
    com.google.zxing.client.result.ResultParser.unescapeBackslash = function(escaped) {
        if (escaped != null) {
            var $0 = escaped.indexOf('\\');
            if ($0 >= 0) {
                var $1 = escaped.length;
                var $2 = new ss.StringBuilder();
                $2.append(escaped.substr(0, $0));
                var $3 = false;
                for (var $4 = $0; $4 < $1; $4++) {
                    var $5 = escaped.charAt($4);
                    if ($3 || $5 !== '\\') {
                        $2.append($5);
                        $3 = false;
                    } else {
                        $3 = true;
                    }
                }
                return $2.toString();
            }
        }
        return escaped;
    }
    com.google.zxing.client.result.ResultParser.$0 = function($p0) {
        if ($p0 == null) {
            return null;
        }
        var $0 = SystemExtend.StringExtend.toCharArray($p0);
        var $1 = com.google.zxing.client.result.ResultParser.$1($0);
        if ($1 < 0) {
            return $p0;
        }
        var $2 = $0.length;
        var $3 = new ss.StringBuilder();
        $3.append($p0.substr(0, $1));
        for (var $4 = $1; $4 < $2; $4++) {
            var $5 = $0[$4];
            if ($5 === '+') {
                $3.append(' ');
            } else if ($5 === '%') {
                if ($4 >= $2 - 2) {
                    $3.append('%');
                } else {
                    var $6 = com.google.zxing.client.result.ResultParser.$2($0[++$4]);
                    var $7 = com.google.zxing.client.result.ResultParser.$2($0[++$4]);
                    if ($6 < 0 || $7 < 0) {
                        $3.append('%');
                        $3.append($0[$4 - 1]);
                        $3.append($0[$4]);
                    }
                    $3.append((($6 << 4) + $7));
                }
            } else {
                $3.append($5);
            }
        }
        return $3.toString();
    }
    com.google.zxing.client.result.ResultParser.$1 = function($p0) {
        var $0 = $p0.length;
        for (var $1 = 0; $1 < $0; $1++) {
            var $2 = $p0[$1];
            if ($2 === '+' || $2 === '%') {
                return $1;
            }
        }
        return -1;
    }
    com.google.zxing.client.result.ResultParser.$2 = function($p0) {
        if (SystemExtend.CharExtend.toInt32($p0) >= SystemExtend.CharExtend.toInt32('a')) {
            if (SystemExtend.CharExtend.toInt32($p0) <= SystemExtend.CharExtend.toInt32('f')) {
                return 10 + (SystemExtend.CharExtend.toInt32($p0) - SystemExtend.CharExtend.toInt32('a'));
            }
        } else if (SystemExtend.CharExtend.toInt32($p0) >= SystemExtend.CharExtend.toInt32('A')) {
            if (SystemExtend.CharExtend.toInt32($p0) <= SystemExtend.CharExtend.toInt32('A')) {
                return 10 + (SystemExtend.CharExtend.toInt32($p0) - SystemExtend.CharExtend.toInt32('A'));
            }
        } else if (SystemExtend.CharExtend.toInt32($p0) >= SystemExtend.CharExtend.toInt32('0')) {
            if (SystemExtend.CharExtend.toInt32($p0) <= SystemExtend.CharExtend.toInt32('9')) {
                return SystemExtend.CharExtend.toInt32($p0) - SystemExtend.CharExtend.toInt32('0');
            }
        }
        return -1;
    }
    com.google.zxing.client.result.ResultParser.isStringOfDigits = function(value_Renamed, length) {
        if (value_Renamed == null) {
            return false;
        }
        var $0 = value_Renamed.length;
        if (length !== $0) {
            return false;
        }
        for (var $1 = 0; $1 < length; $1++) {
            var $2 = value_Renamed.charAt($1);
            if (SystemExtend.CharExtend.toInt32($2) < SystemExtend.CharExtend.toInt32('0') || SystemExtend.CharExtend.toInt32($2) > SystemExtend.CharExtend.toInt32('9')) {
                return false;
            }
        }
        return true;
    }
    com.google.zxing.client.result.ResultParser.isSubstringOfDigits = function(value_Renamed, offset, length) {
        if (value_Renamed == null) {
            return false;
        }
        var $0 = value_Renamed.length;
        var $1 = offset + length;
        if ($0 < $1) {
            return false;
        }
        for (var $2 = offset; $2 < $1; $2++) {
            var $3 = value_Renamed.charAt($2);
            if (SystemExtend.CharExtend.toInt32($3) < SystemExtend.CharExtend.toInt32('0') || SystemExtend.CharExtend.toInt32($3) > SystemExtend.CharExtend.toInt32('9')) {
                return false;
            }
        }
        return true;
    }
    com.google.zxing.client.result.ResultParser.$3 = function($p0) {
        var $0 = $p0.indexOf('?');
        if ($0 < 0) {
            return null;
        }
        var $1 = {};
        $0++;
        var $2;
        while (($2 = $p0.indexOf('&', $0)) >= 0) {
            com.google.zxing.client.result.ResultParser.$4($p0, $0, $2, $1);
            $0 = $2 + 1;
        }
        com.google.zxing.client.result.ResultParser.$4($p0, $0, $p0.length, $1);
        return $1;
    }
    com.google.zxing.client.result.ResultParser.$4 = function($p0, $p1, $p2, $p3) {
        var $0 = $p0.indexOf('=', $p1);
        if ($0 >= 0) {
            var $1 = $p0.substr($p1, $0 - $p1);
            var $2 = $p0.substr($0 + 1, $p2 - ($0 + 1));
            $2 = com.google.zxing.client.result.ResultParser.$0($2);
            $p3[$1] = $2;
        }
    }
    com.google.zxing.client.result.ResultParser.$5 = function($p0, $p1, $p2, $p3) {
        var $0 = null;
        var $1 = 0;
        var $2 = $p1.length;
        while ($1 < $2) {
            $1 = $p1.indexOf($p0, $1);
            if ($1 < 0) {
                break;
            }
            $1 += $p0.length;
            var $3 = $1;
            var $4 = false;
            while (!$4) {
                $1 = $p1.indexOf($p2, $1);
                if ($1 < 0) {
                    $1 = $p1.length;
                    $4 = true;
                } else if ($p1.charAt($1 - 1) === '\\') {
                    $1++;
                } else {
                    if ($0 == null) {
                        $0 = new Array(3);
                    }
                    var $5 = com.google.zxing.client.result.ResultParser.unescapeBackslash($p1.substr($3, $1 - $3));
                    if ($p3) {
                        $5 = $5.trim();
                    }
                    $0.add($5);
                    $1++;
                    $4 = true;
                }
            }
        }
        if ($0 == null || (!$0.length)) {
            return null;
        }
        return com.google.zxing.client.result.ResultParser.$7($0);
    }
    com.google.zxing.client.result.ResultParser.$6 = function($p0, $p1, $p2, $p3) {
        var $0 = com.google.zxing.client.result.ResultParser.$5($p0, $p1, $p2, $p3);
        return ($0 == null) ? null : $0[0];
    }
    com.google.zxing.client.result.ResultParser.$7 = function($p0) {
        var $0 = $p0.length;
        var $1 = new Array($0);
        for (var $2 = 0; $2 < $0; $2++) {
            $1[$2] = ($p0[$2]);
        }
        return $1;
    }
    com.google.zxing.client.result.ZXingQR$B = function() {
        com.google.zxing.client.result.ZXingQR$B.initializeBase(this);
    }
    com.google.zxing.client.result.ZXingQR$B.$8 = function($p0) {
        var $0 = $p0.get_text();
        if ($0 == null) {
            return null;
        }
        var $1;
        if ($0.startsWith('sms:') || $0.startsWith('SMS:') || $0.startsWith('mms:') || $0.startsWith('MMS:')) {
            $1 = 4;
        } else if ($0.startsWith('smsto:') || $0.startsWith('SMSTO:') || $0.startsWith('mmsto:') || $0.startsWith('MMSTO:')) {
            $1 = 6;
        } else {
            return null;
        }
        var $2 = com.google.zxing.client.result.ResultParser.$3($0);
        var $3 = null;
        var $4 = null;
        var $5 = false;
        if ($2 != null && !(!Object.getKeyCount($2))) {
            $3 = ($2['subject']);
            $4 = ($2['body']);
            $5 = true;
        }
        var $6 = $0.indexOf('?', $1);
        var $7;
        if ($6 < 0 || !$5) {
            $7 = $0.substr($1);
        } else {
            $7 = $0.substr($1, $6 - $1);
        }
        var $8 = $7.indexOf(';');
        var $9;
        var $A;
        if ($8 < 0) {
            $9 = $7;
            $A = null;
        } else {
            $9 = $7.substr(0, $8 - (0));
            var $B = $7.substr($8 + 1);
            if ($B.startsWith('via=')) {
                $A = $B.substr(4);
            } else {
                $A = null;
            }
        }
        if ($4 == null) {
            var $C = $9.indexOf(':');
            if ($C >= 0) {
                $4 = $9.substr($C + 1);
                $9 = $9.substr(0, $C - (0));
            }
        }
        return new com.google.zxing.client.result.SMSParsedResult('sms:' + $9, $9, $A, $3, $4, null);
    }
    com.google.zxing.client.result.SMSParsedResult = function(smsURI, number, via, subject, body, title) {
        com.google.zxing.client.result.SMSParsedResult.initializeBase(this, [com.google.zxing.client.result.ParsedResultType.SMS]);
        this.$1 = smsURI;
        this.$2 = number;
        this.$3 = via;
        this.$4 = subject;
        this.$5 = body;
        this.$6 = title;
    }
    com.google.zxing.client.result.SMSParsedResult.prototype = {
        get_SMSURI: function() {
            return this.$1;
        },
        get_number: function() {
            return this.$2;
        },
        get_via: function() {
            return this.$3;
        },
        get_subject: function() {
            return this.$4;
        },
        get_body: function() {
            return this.$5;
        },
        get_title: function() {
            return this.$6;
        },
        get_displayResult: function() {
            var $0 = new ss.StringBuilder();
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$2, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$3, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$4, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$5, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$6, $0);
            return $0.toString();
        },
        $1: null,
        $2: null,
        $3: null,
        $4: null,
        $5: null,
        $6: null
    }
    com.google.zxing.client.result.TelParsedResult = function(number, telURI, title) {
        com.google.zxing.client.result.TelParsedResult.initializeBase(this, [com.google.zxing.client.result.ParsedResultType.TEL]);
        this.$1 = number;
        this.$2 = telURI;
        this.$3 = title;
    }
    com.google.zxing.client.result.TelParsedResult.prototype = {
        get_number: function() {
            return this.$1;
        },
        get_telURI: function() {
            return this.$2;
        },
        get_title: function() {
            return this.$3;
        },
        get_displayResult: function() {
            var $0 = new ss.StringBuilder();
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$1, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$3, $0);
            return $0.toString();
        },
        $1: null,
        $2: null,
        $3: null
    }
    com.google.zxing.client.result.ZXingQR$F = function() {
        com.google.zxing.client.result.ZXingQR$F.initializeBase(this);
    }
    com.google.zxing.client.result.ZXingQR$F.$8 = function($p0) {
        var $0 = $p0.get_text();
        if ($0 == null || (!$0.startsWith('tel:') && !$0.startsWith('TEL:'))) {
            return null;
        }
        var $1 = ($0.startsWith('TEL:')) ? 'tel:' + $0.substr(4) : $0;
        var $2 = $0.indexOf('?', 4);
        var $3 = ($2 < 0) ? $0.substr(4) : $0.substr(4, $2 - (4));
        return new com.google.zxing.client.result.TelParsedResult($3, $1, null);
    }
    com.google.zxing.client.result.TextParsedResult = function(text, language) {
        com.google.zxing.client.result.TextParsedResult.initializeBase(this, [com.google.zxing.client.result.ParsedResultType.TEXT]);
        this.$1 = text;
        this.$2 = language;
    }
    com.google.zxing.client.result.TextParsedResult.prototype = {
        get_text: function() {
            return this.$1;
        },
        get_language: function() {
            return this.$2;
        },
        get_displayResult: function() {
            return this.$1;
        },
        $1: null,
        $2: null
    }
    com.google.zxing.client.result.URIParsedResult = function(uri, title) {
        com.google.zxing.client.result.URIParsedResult.initializeBase(this, [com.google.zxing.client.result.ParsedResultType.URI]);
        this.$1 = com.google.zxing.client.result.URIParsedResult.$4(uri);
        this.$2 = title;
    }
    com.google.zxing.client.result.URIParsedResult.$4 = function($p0) {
        var $0 = $p0.indexOf(':');
        if ($0 < 0) {
            $p0 = 'http://' + $p0;
        } else if (com.google.zxing.client.result.URIParsedResult.$5($p0, $0)) {
            $p0 = 'http://' + $p0;
        } else {
            $p0 = $p0.substr(0, $0 - (0)).toLowerCase() + $p0.substr($0);
        }
        return $p0;
    }
    com.google.zxing.client.result.URIParsedResult.$5 = function($p0, $p1) {
        var $0 = $p0.indexOf('/', $p1 + 1);
        if ($0 < 0) {
            $0 = $p0.length;
        }
        if ($0 <= $p1 + 1) {
            return false;
        }
        for (var $1 = $p1 + 1; $1 < $0; $1++) {
            if ($p0.charAt($1) < '0' || $p0.charAt($1) > '9') {
                return false;
            }
        }
        return true;
    }
    com.google.zxing.client.result.URIParsedResult.prototype = {
        get_URI: function() {
            return this.$1;
        },
        get_title: function() {
            return this.$2;
        },
        get_possiblyMaliciousURI: function() {
            return this.$3();
        },
        get_displayResult: function() {
            var $0 = new ss.StringBuilder();
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$2, $0);
            com.google.zxing.client.result.ParsedResult.maybeAppend1(this.$1, $0);
            return $0.toString();
        },
        $1: null,
        $2: null,
        $3: function() {
            var $0 = this.$1.indexOf(':');
            $0++;
            var $1 = this.$1.length;
            while ($0 < $1 && this.$1.charAt($0) === '/') {
                $0++;
            }
            var $2 = this.$1.indexOf('/', $0);
            if ($2 < 0) {
                $2 = $1;
            }
            var $3 = this.$1.indexOf('@', $0);
            return $3 >= $0 && $3 < $2;
        }
    }
    com.google.zxing.client.result.ZXingQR$D = function() {
        com.google.zxing.client.result.ZXingQR$D.initializeBase(this);
    }
    com.google.zxing.client.result.ZXingQR$D.$8 = function($p0) {
        var $0 = $p0.get_text();
        if ($0 != null && $0.startsWith('URL:')) {
            $0 = $0.substr(4);
        }
        if (!com.google.zxing.client.result.ZXingQR$D.$9($0)) {
            return null;
        }
        return new com.google.zxing.client.result.URIParsedResult($0, null);
    }
    com.google.zxing.client.result.ZXingQR$D.$9 = function($p0) {
        if ($p0 == null || $p0.indexOf(' ') >= 0 || $p0.indexOf('\n') >= 0) {
            return false;
        }
        var $0 = $p0.indexOf('.');
        if ($0 >= $p0.length - 2) {
            return false;
        }
        var $1 = $p0.indexOf(':');
        if ($0 < 0 && $1 < 0) {
            return false;
        }
        if ($1 >= 0) {
            if ($0 < 0 || $0 > $1) {
                for (var $2 = 0; $2 < $1; $2++) {
                    var $3 = $p0.charAt($2);
                    if ((SystemExtend.CharExtend.toInt32($3) < SystemExtend.CharExtend.toInt32('a') || SystemExtend.CharExtend.toInt32($3) > SystemExtend.CharExtend.toInt32('z')) && (SystemExtend.CharExtend.toInt32($3) < SystemExtend.CharExtend.toInt32('A') || SystemExtend.CharExtend.toInt32($3) > SystemExtend.CharExtend.toInt32('Z'))) {
                        return false;
                    }
                }
            } else {
                if ($1 >= $p0.length - 2) {
                    return false;
                }
                for (var $4 = $1 + 1; $4 < $1 + 3; $4++) {
                    var $5 = $p0.charAt($4);
                    if (SystemExtend.CharExtend.toInt32($5) < SystemExtend.CharExtend.toInt32('0') || SystemExtend.CharExtend.toInt32($5) > SystemExtend.CharExtend.toInt32('9')) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    com.google.zxing.client.result.ZXingQR$A = function() {}
    com.google.zxing.client.result.ZXingQR$A.$0 = function($p0) {
        var $0 = $p0.get_text();
        if ($0 == null || (!$0.startsWith('urlto:') && !$0.startsWith('URLTO:'))) {
            return null;
        }
        var $1 = $0.indexOf(':', 6);
        if ($1 < 0) {
            return null;
        }
        var $2 = ($1 <= 6) ? null : $0.substr(6, $1 - (6));
        var $3 = $0.substr($1 + 1);
        return new com.google.zxing.client.result.URIParsedResult($3, $2);
    }
    com.google.zxing.client.result.ZXingQR$E = function() {
        com.google.zxing.client.result.ZXingQR$E.initializeBase(this);
    }
    com.google.zxing.client.result.ZXingQR$E.$8 = function($p0) {
        var $0 = $p0.get_text();
        if ($0 == null || !$0.startsWith('BEGIN:VCARD')) {
            return null;
        }
        var $1 = com.google.zxing.client.result.ZXingQR$E.$9('FN', $0, true);
        if ($1 == null) {
            $1 = com.google.zxing.client.result.ZXingQR$E.$9('N', $0, true);
            com.google.zxing.client.result.ZXingQR$E.$D($1);
        }
        var $2 = com.google.zxing.client.result.ZXingQR$E.$9('TEL', $0, true);
        var $3 = com.google.zxing.client.result.ZXingQR$E.$9('EMAIL', $0, true);
        var $4 = com.google.zxing.client.result.ZXingQR$E.$A('NOTE', $0, false);
        var $5 = com.google.zxing.client.result.ZXingQR$E.$9('ADR', $0, true);
        if ($5 != null) {
            for (var $A = 0; $A < $5.length; $A++) {
                $5[$A] = com.google.zxing.client.result.ZXingQR$E.$C($5[$A]);
            }
        }
        var $6 = com.google.zxing.client.result.ZXingQR$E.$A('ORG', $0, true);
        var $7 = com.google.zxing.client.result.ZXingQR$E.$A('BDAY', $0, true);
        if (!com.google.zxing.client.result.ZXingQR$E.$B($7)) {
            $7 = null;
        }
        var $8 = com.google.zxing.client.result.ZXingQR$E.$A('TITLE', $0, true);
        var $9 = com.google.zxing.client.result.ZXingQR$E.$A('URL', $0, true);
        return new com.google.zxing.client.result.AddressBookParsedResult($1, null, $2, $3, $4, $5, $6, $7, $8, $9);
    }
    com.google.zxing.client.result.ZXingQR$E.$9 = function($p0, $p1, $p2) {
        var $0 = null;
        var $1 = 0;
        var $2 = $p1.length;
        while ($1 < $2) {
            $1 = $p1.indexOf($p0, $1);
            if ($1 < 0) {
                break;
            }
            if ($1 > 0 && $p1.charAt($1 - 1) !== '\n') {
                $1++;
                continue;
            }
            $1 += $p0.length;
            if ($p1.charAt($1) !== ':' && $p1.charAt($1) !== ';') {
                continue;
            }
            while ($p1.charAt($1) !== ':') {
                $1++;
            }
            $1++;
            var $3 = $1;
            $1 = $p1.indexOf('\n', $1);
            if ($1 < 0) {
                $1 = $2;
            } else if ($1 > $3) {
                if ($0 == null) {
                    $0 = new Array(3);
                }
                var $4 = $p1.substr($3, $1 - $3);
                if ($p2) {
                    $4 = $4.trim();
                }
                $0.add($4);
                $1++;
            } else {
                $1++;
            }
        }
        if ($0 == null || (!$0.length)) {
            return null;
        }
        return com.google.zxing.client.result.ResultParser.$7($0);
    }
    com.google.zxing.client.result.ZXingQR$E.$A = function($p0, $p1, $p2) {
        var $0 = com.google.zxing.client.result.ZXingQR$E.$9($p0, $p1, $p2);
        return ($0 == null) ? null : $0[0];
    }
    com.google.zxing.client.result.ZXingQR$E.$B = function($p0) {
        if ($p0 == null) {
            return true;
        }
        if (com.google.zxing.client.result.ResultParser.isStringOfDigits($p0, 8)) {
            return true;
        }
        return $p0.length === 10 && $p0.charAt(4) === '-' && $p0.charAt(7) === '-' && com.google.zxing.client.result.ResultParser.isSubstringOfDigits($p0, 0, 4) && com.google.zxing.client.result.ResultParser.isSubstringOfDigits($p0, 5, 2) && com.google.zxing.client.result.ResultParser.isSubstringOfDigits($p0, 8, 2);
    }
    com.google.zxing.client.result.ZXingQR$E.$C = function($p0) {
        if ($p0 == null) {
            return null;
        }
        var $0 = $p0.length;
        var $1 = new ss.StringBuilder();
        for (var $2 = 0; $2 < $0; $2++) {
            var $3 = $p0.charAt($2);
            if ($3 === ';') {
                $1.append(' ');
            } else {
                $1.append($3);
            }
        }
        return $1.toString().trim();
    }
    com.google.zxing.client.result.ZXingQR$E.$D = function($p0) {
        if ($p0 != null) {
            for (var $0 = 0; $0 < $p0.length; $0++) {
                var $1 = $p0[$0];
                var $2 = new Array(5);
                var $3 = 0;
                var $4;
                var $5 = 0;
                while (($4 = $1.indexOf(';', $3)) > 0) {
                    $2[$5] = $1.substr($3, $4 - $3);
                    $5++;
                    $3 = $4 + 1;
                }
                $2[$5] = $1.substr($3);
                var $6 = new ss.StringBuilder();
                com.google.zxing.client.result.ZXingQR$E.$E($2, 3, $6);
                com.google.zxing.client.result.ZXingQR$E.$E($2, 1, $6);
                com.google.zxing.client.result.ZXingQR$E.$E($2, 2, $6);
                com.google.zxing.client.result.ZXingQR$E.$E($2, 0, $6);
                com.google.zxing.client.result.ZXingQR$E.$E($2, 4, $6);
                $p0[$0] = $6.toString().trim();
            }
        }
    }
    com.google.zxing.client.result.ZXingQR$E.$E = function($p0, $p1, $p2) {
        if ($p0[$p1] != null) {
            $p2.append(' ');
            $p2.append($p0[$p1]);
        }
    }
    com.google.zxing.client.result.ZXingQR$1D = function() {
        com.google.zxing.client.result.ZXingQR$1D.initializeBase(this);
    }
    com.google.zxing.client.result.ZXingQR$1D.$8 = function($p0) {
        var $0 = $p0.get_text();
        if ($0 == null) {
            return null;
        }
        var $1 = $0.indexOf('BEGIN:VEVENT');
        if ($1 < 0) {
            return null;
        }
        var $2 = $0.indexOf('END:VEVENT');
        if ($2 < 0) {
            return null;
        }
        var $3 = com.google.zxing.client.result.ZXingQR$E.$A('SUMMARY', $0, true);
        var $4 = com.google.zxing.client.result.ZXingQR$E.$A('DTSTART', $0, true);
        var $5 = com.google.zxing.client.result.ZXingQR$E.$A('DTEND', $0, true);
        try {
            return new com.google.zxing.client.result.CalendarParsedResult($3, $4, $5, null, null, null);
        } catch ($6) {
            return null;
        }
    }
    Type.registerNamespace('com.google.zxing.client.result.optional');
    com.google.zxing.client.result.optional.ZXingQR$1C = function() {
        com.google.zxing.client.result.optional.ZXingQR$1C.initializeBase(this);
    }
    com.google.zxing.client.result.optional.ZXingQR$1C.$8 = function($p0, $p1, $p2, $p3) {
        try {
            var $0;
            $0 = SystemExtend.Text.Encoding.getEncoding($p3).getString(SupportClass.toByteArray1($p0));
            return $0.substr($p1, $p2);
        } catch ($1) {
            throw new Error('SystemExpection: Platform does not support required encoding: ' + $1);
        }
    }
    com.google.zxing.client.result.optional.ZXingQR$9 = function(header, type, payload, totalRecordLength) {
        this.$B = header;
        this.$C = type;
        this.$D = payload;
        this.$E = totalRecordLength;
    }
    com.google.zxing.client.result.optional.ZXingQR$9.$F = function($p0, $p1) {
        var $0 = $p0[$p1] & 255;
        if (!!(($0 ^ 17) & 63)) {
            return null;
        }
        var $1 = $p0[$p1 + 1] & 255;
        var $2 = $p0[$p1 + 2] & 255;
        var $3 = com.google.zxing.client.result.optional.ZXingQR$1C.$8($p0, $p1 + 3, $1, 'US-ASCII');
        var $4 = new Array($2);
        SystemExtend.ArrayExtend.copy($p0, $p1 + 3 + $1, $4, 0, $2);
        return new com.google.zxing.client.result.optional.ZXingQR$9($0, $3, $4, 3 + $1 + $2);
    }
    com.google.zxing.client.result.optional.ZXingQR$9.prototype = {
        get_$0: function() {
            return !!(this.$B & 128);
        },
        get_$1: function() {
            return !!(this.$B & 64);
        },
        get_$2: function() {
            return this.$C;
        },
        get_$3: function() {
            return this.$D;
        },
        get_$4: function() {
            return this.$E;
        },
        $B: 0,
        $C: null,
        $D: null,
        $E: 0
    }
    com.google.zxing.client.result.optional.NDEFSmartPosterParsedResult = function(action, uri, title) {
        com.google.zxing.client.result.optional.NDEFSmartPosterParsedResult.initializeBase(this, [com.google.zxing.client.result.ParsedResultType.ndeF_SMART_POSTER]);
        this.$3 = action;
        this.$2 = uri;
        this.$1 = title;
    }
    com.google.zxing.client.result.optional.NDEFSmartPosterParsedResult.prototype = {
        get_title: function() {
            return this.$1;
        },
        get_URI: function() {
            return this.$2;
        },
        get_action: function() {
            return this.$3;
        },
        get_displayResult: function() {
            if (this.$1 == null) {
                return this.$2;
            } else {
                return this.$1 + '\n' + this.$2;
            }
        },
        $1: null,
        $2: null,
        $3: 0
    }
    com.google.zxing.client.result.optional.ZXingQR$23 = function() {
        com.google.zxing.client.result.optional.ZXingQR$23.initializeBase(this);
    }
    com.google.zxing.client.result.optional.ZXingQR$23.$9 = function($p0) {
        var $0 = $p0.get_rawBytes();
        if ($0 == null) {
            return null;
        }
        var $1 = com.google.zxing.client.result.optional.ZXingQR$9.$F($0, 0);
        if ($1 == null || !$1.get_$0() || !$1.get_$1()) {
            return null;
        }
        if (!($1.get_$2() === 'Sp')) {
            return null;
        }
        var $2 = 0;
        var $3 = 0;
        var $4 = null;
        var $5 = $1.get_$3();
        var $6 = com.google.zxing.client.result.optional.NDEFSmartPosterParsedResult.actioN_UNSPECIFIED;
        var $7 = null;
        var $8 = null;
        while ($2 < $5.length && ($4 = com.google.zxing.client.result.optional.ZXingQR$9.$F($5, $2)) != null) {
            if (!$3 && !$4.get_$0()) {
                return null;
            }
            var $9 = $4.get_$2();
            if ('T' === $9) {
                var $A = com.google.zxing.client.result.optional.ZXingQR$24.$A($4.get_$3());
                $7 = $A[1];
            } else if ('U' === $9) {
                $8 = com.google.zxing.client.result.optional.ZXingQR$21.$B($4.get_$3());
            } else if ('act' === $9) {
                $6 = $4.get_$3()[0];
            }
            $3++;
            $2 += $4.get_$4();
        }
        if (!$3 || ($4 != null && !$4.get_$1())) {
            return null;
        }
        return new com.google.zxing.client.result.optional.NDEFSmartPosterParsedResult($6, $8, $7);
    }
    com.google.zxing.client.result.optional.ZXingQR$24 = function() {
        com.google.zxing.client.result.optional.ZXingQR$24.initializeBase(this);
    }
    com.google.zxing.client.result.optional.ZXingQR$24.$9 = function($p0) {
        var $0 = $p0.get_rawBytes();
        if ($0 == null) {
            return null;
        }
        var $1 = com.google.zxing.client.result.optional.ZXingQR$9.$F($0, 0);
        if ($1 == null || !$1.get_$0() || !$1.get_$1()) {
            return null;
        }
        if (!($1.get_$2() === 'T')) {
            return null;
        }
        var $2 = com.google.zxing.client.result.optional.ZXingQR$24.$A($1.get_$3());
        return new com.google.zxing.client.result.TextParsedResult($2[0], $2[1]);
    }
    com.google.zxing.client.result.optional.ZXingQR$24.$A = function($p0) {
        var $0 = $p0[0];
        var $1 = !!($0 & 128);
        var $2 = $0 & 31;
        var $3 = com.google.zxing.client.result.optional.ZXingQR$1C.$8($p0, 1, $2, 'US-ASCII');
        var $4 = ($1) ? 'UTF-16' : 'UTF-8';
        var $5 = com.google.zxing.client.result.optional.ZXingQR$1C.$8($p0, 1 + $2, $p0.length - $2 - 1, $4);
        return [$3, $5];
    }
    com.google.zxing.client.result.optional.ZXingQR$21 = function() {
        com.google.zxing.client.result.optional.ZXingQR$21.initializeBase(this);
    }
    com.google.zxing.client.result.optional.ZXingQR$21.$A = function($p0) {
        var $0 = $p0.get_rawBytes();
        if ($0 == null) {
            return null;
        }
        var $1 = com.google.zxing.client.result.optional.ZXingQR$9.$F($0, 0);
        if ($1 == null || !$1.get_$0() || !$1.get_$1()) {
            return null;
        }
        if (!($1.get_$2() === 'U')) {
            return null;
        }
        var $2 = com.google.zxing.client.result.optional.ZXingQR$21.$B($1.get_$3());
        return new com.google.zxing.client.result.URIParsedResult($2, null);
    }
    com.google.zxing.client.result.optional.ZXingQR$21.$B = function($p0) {
        var $0 = $p0[0] & 255;
        var $1 = null;
        if ($0 < com.google.zxing.client.result.optional.ZXingQR$21.$9.length) {
            $1 = com.google.zxing.client.result.optional.ZXingQR$21.$9[$0];
        }
        var $2 = com.google.zxing.client.result.optional.ZXingQR$1C.$8($p0, 1, $p0.length - 1, 'UTF-8');
        return ($1 == null) ? $2 : $1 + $2;
    }
    Type.registerNamespace('com.google.zxing.common');
    com.google.zxing.common.Comparator = function() {};
    com.google.zxing.common.Comparator.registerInterface('com.google.zxing.common.Comparator');
    com.google.zxing.common.BitArray = function(size) {
        if (size < 1) {
            throw new Error('size must be at least 1');
        }
        this.size = size;
        this.bits = com.google.zxing.common.BitArray.$0(size);
    }
    com.google.zxing.common.BitArray.$0 = function($p0) {
        var $0 = $p0 >> 5;
        if (!!($p0 & 31)) {
            $0++;
        }
        return new Array($0);
    }
    com.google.zxing.common.BitArray.prototype = {
        get_size: function() {
            return this.size;
        },
        bits: null,
        size: 0,
        get_Renamed: function(i) {
            return !!(this.bits[i >> 5] & (1 << (i & 31)));
        },
        set_Renamed: function(i) {
            this.bits[i >> 5] |= 1 << (i & 31);
        },
        flip: function(i) {
            this.bits[i >> 5] ^= 1 << (i & 31);
        },
        setBulk: function(i, newBits) {
            this.bits[i >> 5] = newBits;
        },
        clear: function() {
            var $0 = this.bits.length;
            for (var $1 = 0; $1 < $0; $1++) {
                this.bits[$1] = 0;
            }
        },
        isRange: function(start, end, value_Renamed) {
            if (end < start) {
                throw new Error('ArgumentException');
            }
            if (end === start) {
                return true;
            }
            end--;
            var $0 = start >> 5;
            var $1 = end >> 5;
            for (var $2 = $0; $2 <= $1; $2++) {
                var $3 = ($2 > $0) ? 0 : start & 31;
                var $4 = ($2 < $1) ? 31 : end & 31;
                var $5;
                if (!$3 && $4 === 31) {
                    $5 = -1;
                } else {
                    $5 = 0;
                    for (var $6 = $3; $6 <= $4; $6++) {
                        $5 |= 1 << $6;
                    }
                }
                if ((this.bits[$2] & $5) !== ((value_Renamed) ? $5 : 0)) {
                    return false;
                }
            }
            return true;
        },
        getBitArray: function() {
            return this.bits;
        },
        reverse: function() {
            var $0 = new Array(this.bits.length);
            var $1 = this.size;
            for (var $2 = 0; $2 < $1; $2++) {
                if (this.get_Renamed($1 - $2 - 1)) {
                    $0[$2 >> 5] |= 1 << ($2 & 31);
                }
            }
            this.bits = $0;
        },
        toString: function() {
            var $0 = new ss.StringBuilder();
            for (var $1 = 0; $1 < this.size; $1++) {
                if (!($1 & 7)) {
                    $0.append(' ');
                }
                $0.append((this.get_Renamed($1)) ? 'X' : '.');
            }
            return $0.toString();
        }
    }
    com.google.zxing.common.BitMatrix = function(width, height) {
        if (width < 1 || height < 1) {
            throw new Error('Both dimensions must be greater than 0');
        }
        this.width = width;
        this.height = height;
        var $0 = width >> 5;
        if (!!(width & 31)) {
            $0++;
        }
        this.rowSize = $0;
        this.bits = new Array($0 * height);
        for (var $1 = 0; $1 < this.bits.length; $1++) {
            this.bits[$1] = 0;
        }
    }
    com.google.zxing.common.BitMatrix.createSquareInstance = function(dimension) {
        return new com.google.zxing.common.BitMatrix(dimension, dimension);
    }
    com.google.zxing.common.BitMatrix.prototype = {
        get_width: function() {
            return this.width;
        },
        get_height: function() {
            return this.height;
        },
        get_dimension: function() {
            if (this.width !== this.height) {
                throw new Error("SystemExpection: Can't call getDimension() on a non-square matrix");
            }
            return this.width;
        },
        width: 0,
        height: 0,
        rowSize: 0,
        bits: null,
        get_Renamed: function(x, y) {
            var $0 = y * this.rowSize + (x >> 5);
            return !!(SupportClass.urShift1(this.bits[$0], (x & 31)) & 1);
        },
        set_Renamed: function(x, y) {
            var $0 = y * this.rowSize + (x >> 5);
            this.bits[$0] |= 1 << (x & 31);
        },
        flip: function(x, y) {
            var $0 = y * this.rowSize + (x >> 5);
            this.bits[$0] ^= 1 << (x & 31);
        },
        clear: function() {
            var $0 = this.bits.length;
            for (var $1 = 0; $1 < $0; $1++) {
                this.bits[$1] = 0;
            }
        },
        setRegion: function(left, top, width, height) {
            if (top < 0 || left < 0) {
                throw new Error('Left and top must be nonnegative');
            }
            if (height < 1 || width < 1) {
                throw new Error('Height and width must be at least 1');
            }
            var $0 = left + width;
            var $1 = top + height;
            if ($1 > this.height || $0 > this.width) {
                throw new Error('The region must fit inside the matrix');
            }
            for (var $2 = top; $2 < $1; $2++) {
                var $3 = $2 * this.rowSize;
                for (var $4 = left; $4 < $0; $4++) {
                    this.bits[$3 + ($4 >> 5)] |= 1 << ($4 & 31);
                }
            }
        },
        getRow: function(y, row) {
            if (row == null || row.get_size() < this.width) {
                row = new com.google.zxing.common.BitArray(this.width);
            }
            var $0 = y * this.rowSize;
            for (var $1 = 0; $1 < this.rowSize; $1++) {
                row.setBulk($1 << 5, this.bits[$0 + $1]);
            }
            return row;
        },
        toString: function() {
            var $0 = new ss.StringBuilder();
            for (var $1 = 0; $1 < this.height; $1++) {
                for (var $2 = 0; $2 < this.width; $2++) {
                    $0.append((this.get_Renamed($2, $1)) ? 'X ' : '  ');
                }
                $0.append('\n');
            }
            return $0.toString();
        }
    }
    com.google.zxing.common.BitSource = function(bytes) {
        this.$0 = bytes;
    }
    com.google.zxing.common.BitSource.prototype = {
        $0: null,
        $1: 0,
        $2: 0,
        readBits: function(numBits) {
            if (numBits < 1 || numBits > 32) {
                throw new Error('ArgumentException');
            }
            var $0 = 0;
            if (this.$2 > 0) {
                var $1 = 8 - this.$2;
                var $2 = (numBits < $1) ? numBits : $1;
                var $3 = $1 - $2;
                var $4 = (255 >> (8 - $2)) << $3;
                $0 = (this.$0[this.$1] & $4) >> $3;
                numBits -= $2;
                this.$2 += $2;
                if (this.$2 === 8) {
                    this.$2 = 0;
                    this.$1++;
                }
            }
            if (numBits > 0) {
                while (numBits >= 8) {
                    $0 = ($0 << 8) | (this.$0[this.$1] & 255);
                    this.$1++;
                    numBits -= 8;
                }
                if (numBits > 0) {
                    var $5 = 8 - numBits;
                    var $6 = (255 >> $5) << $5;
                    $0 = ($0 << numBits) | ((this.$0[this.$1] & $6) >> $5);
                    this.$2 += numBits;
                }
            }
            return $0;
        },
        available: function() {
            return 8 * (this.$0.length - this.$1) - this.$2;
        }
    }
    com.google.zxing.common.ByteArray = function(size) {
        this.$1 = new Array(size);
        this.$2 = size;
    }
    com.google.zxing.common.ByteArray.prototype = {
        get_empty: function() {
            return !this.$2;
        },
        $1: null,
        $2: 0,
        at: function(index) {
            return this.$1[index] & 255;
        },
        set_Renamed1: function(index, value_Renamed) {
            this.$1[index] = value_Renamed;
        },
        size: function() {
            return this.$2;
        },
        appendByte: function(value_Renamed) {
            if (!this.$2 || this.$2 >= this.$1.length) {
                var $0 = Math.max(32, this.$2 << 1);
                this.reserve($0);
            }
            this.$1[this.$2] = value_Renamed;
            this.$2++;
        },
        reserve: function(capacity) {
            if (this.$1 == null || this.$1.length < capacity) {
                var $0 = new Array(capacity);
                if (this.$1 != null) {
                    SystemExtend.ArrayExtend.copy(this.$1, 0, $0, 0, this.$1.length);
                }
                this.$1 = $0;
            }
        },
        set_Renamed2: function(source, offset, count) {
            this.$1 = new Array(count);
            this.$2 = count;
            for (var $0 = 0; $0 < count; $0++) {
                this.$1[$0] = source[offset + $0];
            }
        }
    }
    com.google.zxing.common.ByteMatrix = function(width, height) {
        this.$0 = new Array(height);
        for (var $0 = 0; $0 < height; $0++) {
            this.$0[$0] = new Array(width);
        }
        this.$1 = width;
        this.$2 = height;
    }
    com.google.zxing.common.ByteMatrix.prototype = {
        get_height: function() {
            return this.$2;
        },
        get_width: function() {
            return this.$1;
        },
        get_array: function() {
            return this.$0;
        },
        $0: null,
        $1: 0,
        $2: 0,
        get_Renamed: function(x, y) {
            return this.$0[y][x];
        },
        set_Renamed: function(x, y, value_Renamed) {
            this.$0[y][x] = value_Renamed;
        },
        clear: function(value_Renamed) {
            for (var $0 = 0; $0 < this.$2; ++$0) {
                for (var $1 = 0; $1 < this.$1; ++$1) {
                    this.$0[$0][$1] = value_Renamed;
                }
            }
        },
        toString: function() {
            var $0 = new ss.StringBuilder();
            for (var $1 = 0; $1 < this.$2; ++$1) {
                for (var $2 = 0; $2 < this.$1; ++$2) {
                    switch (this.$0[$1][$2]) {
                        case 0:
                            $0.append(' 0');
                            break;
                        case 1:
                            $0.append(' 1');
                            break;
                        default:
                            $0.append('  ');
                            break;
                    }
                }
                $0.append('\n');
            }
            return $0.toString();
        },
        toBitmap: function() {
            var $0 = 0;
            var $1 = 255;
            var $2 = this.get_array();
            var $3 = this.get_width();
            var $4 = this.get_height();
            var $5 = new Array($3 * $4);
            for (var $8 = 0; $8 < $4; $8++) {
                var $9 = $8 * $3;
                for (var $A = 0; $A < $3; $A++) {
                    $5[$9 + $A] = (!$2[$8][$A]) ? $0 : $1;
                }
            }
            var $6 = new SystemExtend.Drawing.Bitmap($3, $4, 1);
            var $7 = $6.lockBits(new SystemExtend.Drawing.Rectangle(0, 0, $6.get_width(), $6.get_height()), 4, $6.get_pixelFormat());
            SystemExtend.ArrayExtend.copy($5, 0, $7.get_scan0(), 0, $5.length);
            $6.unlockBits($7);
            return $6;
        }
    }
    com.google.zxing.common.CharacterSetECI = function(value_Renamed, encodingName) {
        com.google.zxing.common.CharacterSetECI.initializeBase(this, [value_Renamed]);
        this.$4 = encodingName;
    }
    com.google.zxing.common.CharacterSetECI.$3 = function() {
        com.google.zxing.common.CharacterSetECI.$1 = {};
        com.google.zxing.common.CharacterSetECI.$2 = {};
        com.google.zxing.common.CharacterSetECI.$5(0, 'Cp437');
        com.google.zxing.common.CharacterSetECI.$6(1, ['ISO8859_1', 'ISO-8859-1']);
        com.google.zxing.common.CharacterSetECI.$5(2, 'Cp437');
        com.google.zxing.common.CharacterSetECI.$6(3, ['ISO8859_1', 'ISO-8859-1']);
        com.google.zxing.common.CharacterSetECI.$5(4, 'ISO8859_2');
        com.google.zxing.common.CharacterSetECI.$5(5, 'ISO8859_3');
        com.google.zxing.common.CharacterSetECI.$5(6, 'ISO8859_4');
        com.google.zxing.common.CharacterSetECI.$5(7, 'ISO8859_5');
        com.google.zxing.common.CharacterSetECI.$5(8, 'ISO8859_6');
        com.google.zxing.common.CharacterSetECI.$5(9, 'ISO8859_7');
        com.google.zxing.common.CharacterSetECI.$5(10, 'ISO8859_8');
        com.google.zxing.common.CharacterSetECI.$5(11, 'ISO8859_9');
        com.google.zxing.common.CharacterSetECI.$5(12, 'ISO8859_10');
        com.google.zxing.common.CharacterSetECI.$5(13, 'ISO8859_11');
        com.google.zxing.common.CharacterSetECI.$5(15, 'ISO8859_13');
        com.google.zxing.common.CharacterSetECI.$5(16, 'ISO8859_14');
        com.google.zxing.common.CharacterSetECI.$5(17, 'ISO8859_15');
        com.google.zxing.common.CharacterSetECI.$5(18, 'ISO8859_16');
        com.google.zxing.common.CharacterSetECI.$6(20, ['SJIS', 'Shift_JIS']);
    }
    com.google.zxing.common.CharacterSetECI.$5 = function($p0, $p1) {
        var $0 = new com.google.zxing.common.CharacterSetECI($p0, $p1);
        com.google.zxing.common.CharacterSetECI.$1[$p0] = $0;
        com.google.zxing.common.CharacterSetECI.$2[$p1] = $0;
    }
    com.google.zxing.common.CharacterSetECI.$6 = function($p0, $p1) {
        var $0 = new com.google.zxing.common.CharacterSetECI($p0, $p1[0]);
        com.google.zxing.common.CharacterSetECI.$1[$p0] = $0;
        for (var $1 = 0; $1 < $p1.length; $1++) {
            com.google.zxing.common.CharacterSetECI.$2[$p1[$1]] = $0;
        }
    }
    com.google.zxing.common.CharacterSetECI.getCharacterSetECIByValue = function(value_Renamed) {
        if (com.google.zxing.common.CharacterSetECI.$1 == null) {
            com.google.zxing.common.CharacterSetECI.$3();
        }
        if (value_Renamed < 0 || value_Renamed >= 900) {
            throw new Error('Bad ECI value: ' + value_Renamed);
        }
        return com.google.zxing.common.CharacterSetECI.$1[value_Renamed];
    }
    com.google.zxing.common.CharacterSetECI.getCharacterSetECIByName = function(name) {
        if (com.google.zxing.common.CharacterSetECI.$2 == null) {
            com.google.zxing.common.CharacterSetECI.$3();
        }
        return com.google.zxing.common.CharacterSetECI.$2[name];
    }
    com.google.zxing.common.CharacterSetECI.prototype = {
        get_encodingName: function() {
            return this.$4;
        },
        $4: null
    }
    com.google.zxing.common.Collections = function() {}
    com.google.zxing.common.Collections.insertionSort = function(vector, comparator) {
        var $0 = vector.length;
        for (var $1 = 1; $1 < $0; $1++) {
            var $2 = vector[$1];
            var $3 = $1 - 1;
            var $4;
            while ($3 >= 0 && comparator.compare(($4 = vector[$3]), $2) > 0) {
                vector[$3 + 1] = $4;
                $3--;
            }
            vector[$3 + 1] = $2;
        }
    }
    com.google.zxing.common.DecoderResult = function(rawBytes, text, byteSegments, ecLevel) {
        if (rawBytes == null && text == null) {
            throw new Error('ArgumentException');
        }
        this.$0 = rawBytes;
        this.$1 = text;
        this.$2 = byteSegments;
        this.$3 = ecLevel;
    }
    com.google.zxing.common.DecoderResult.prototype = {
        get_rawBytes: function() {
            return this.$0;
        },
        get_text: function() {
            return this.$1;
        },
        get_byteSegments: function() {
            return this.$2;
        },
        get_ecLevel: function() {
            return this.$3;
        },
        $0: null,
        $1: null,
        $2: null,
        $3: null
    }
    com.google.zxing.common.DefaultGridSampler = function() {
        com.google.zxing.common.DefaultGridSampler.initializeBase(this);
    }
    com.google.zxing.common.DefaultGridSampler.prototype = {
        sampleGrid1: function(image, dimension, p1ToX, p1ToY, p2ToX, p2ToY, p3ToX, p3ToY, p4ToX, p4ToY, p1FromX, p1FromY, p2FromX, p2FromY, p3FromX, p3FromY, p4FromX, p4FromY) {
            var $0 = com.google.zxing.common.PerspectiveTransform.quadrilateralToQuadrilateral(p1ToX, p1ToY, p2ToX, p2ToY, p3ToX, p3ToY, p4ToX, p4ToY, p1FromX, p1FromY, p2FromX, p2FromY, p3FromX, p3FromY, p4FromX, p4FromY);
            return this.sampleGrid2(image, dimension, $0);
        },
        sampleGrid2: function(image, dimension, transform) {
            var $0 = com.google.zxing.common.BitMatrix.createSquareInstance(dimension);
            var $1 = new Array(dimension << 1);
            for (var $2 = 0; $2 < dimension; $2++) {
                var $3 = $1.length;
                var $4 = $2 + 0.5;
                for (var $5 = 0; $5 < $3; $5 += 2) {
                    $1[$5] = ($5 >> 1) + 0.5;
                    $1[$5 + 1] = $4;
                }
                transform.transformPoints1($1);
                com.google.zxing.common.GridSampler.checkAndNudgePoints(image, $1);
                try {
                    for (var $6 = 0; $6 < $3; $6 += 2) {
                        if (image.get_Renamed(Math.floor($1[$6]), Math.floor($1[$6 + 1]))) {
                            $0.set_Renamed($6 >> 1, $2);
                        }
                    }
                } catch ($7) {
                    throw new Error('ReaderException');
                }
            }
            return $0;
        }
    }
    com.google.zxing.common.DetectorResult = function(bits, points) {
        this.$0 = bits;
        this.$1 = points;
    }
    com.google.zxing.common.DetectorResult.prototype = {
        get_bits: function() {
            return this.$0;
        },
        get_points: function() {
            return this.$1;
        },
        $0: null,
        $1: null
    }
    com.google.zxing.common.ECI = function(value_Renamed) {
        this.$0 = value_Renamed;
    }
    com.google.zxing.common.ECI.getECIByValue = function(value_Renamed) {
        if (value_Renamed < 0 || value_Renamed > 999999) {
            throw new Error('Bad ECI value: ' + value_Renamed);
        }
        if (value_Renamed < 900) {
            return com.google.zxing.common.CharacterSetECI.getCharacterSetECIByValue(value_Renamed);
        }
        return null;
    }
    com.google.zxing.common.ECI.prototype = {
        get_value: function() {
            return this.$0;
        },
        $0: 0
    }
    com.google.zxing.common.GlobalHistogramBinarizer = function(source) {
        com.google.zxing.common.GlobalHistogramBinarizer.initializeBase(this, [source]);
    }
    com.google.zxing.common.GlobalHistogramBinarizer.$7 = function($p0) {
        var $0 = $p0.length;
        var $1 = 0;
        var $2 = 0;
        var $3 = 0;
        for (var $8 = 0; $8 < $0; $8++) {
            if ($p0[$8] > $3) {
                $2 = $8;
                $3 = $p0[$8];
            }
            if ($p0[$8] > $1) {
                $1 = $p0[$8];
            }
        }
        var $4 = 0;
        var $5 = 0;
        for (var $9 = 0; $9 < $0; $9++) {
            var $A = $9 - $2;
            var $B = $p0[$9] * $A * $A;
            if ($B > $5) {
                $4 = $9;
                $5 = $B;
            }
        }
        if ($2 > $4) {
            var $C = $2;
            $2 = $4;
            $4 = $C;
        }
        if ($4 - $2 <= $0 >> 4) {
            throw new Error('ReaderException');
        }
        var $6 = $4 - 1;
        var $7 = -1;
        for (var $D = $4 - 1; $D > $2; $D--) {
            var $E = $D - $2;
            var $F = $E * $E * ($4 - $D) * ($1 - $p0[$D]);
            if ($F > $7) {
                $6 = $D;
                $7 = $F;
            }
        }
        return $6 << com.google.zxing.common.GlobalHistogramBinarizer.$2;
    }
    com.google.zxing.common.GlobalHistogramBinarizer.prototype = {
        get_blackMatrix: function() {
            var $0 = this.get_luminanceSource();
            var $1;
            var $2 = $0.get_width();
            var $3 = $0.get_height();
            var $4 = new com.google.zxing.common.BitMatrix($2, $3);
            this.$6($2);
            var $5 = this.$5;
            for (var $7 = 1; $7 < 5; $7++) {
                var $8 = Math.floor($3 * $7 / 5);
                $1 = $0.getRow($8, this.$4);
                var $9 = Math.floor(($2 << 2) / 5);
                for (var $A = Math.floor($2 / 5); $A < $9; $A++) {
                    var $B = $1[$A] & 255;
                    $5[$B >> com.google.zxing.common.GlobalHistogramBinarizer.$2]++;
                }
            }
            var $6 = com.google.zxing.common.GlobalHistogramBinarizer.$7($5);
            $1 = $0.get_matrix();
            for (var $C = 0; $C < $3; $C++) {
                var $D = $C * $2;
                for (var $E = 0; $E < $2; $E++) {
                    var $F = $1[$D + $E] & 255;
                    if ($F < $6) {
                        $4.set_Renamed($E, $C);
                    }
                }
            }
            return $4;
        },
        $4: null,
        $5: null,
        getBlackRow: function(y, row) {
            var $0 = this.get_luminanceSource();
            var $1 = $0.get_width();
            if (row == null || row.get_size() < $1) {
                row = new com.google.zxing.common.BitArray($1);
            } else {
                row.clear();
            }
            this.$6($1);
            var $2 = $0.getRow(y, this.$4);
            var $3 = this.$5;
            for (var $7 = 0; $7 < $1; $7++) {
                var $8 = $2[$7] & 255;
                $3[$8 >> com.google.zxing.common.GlobalHistogramBinarizer.$2]++;
            }
            var $4 = com.google.zxing.common.GlobalHistogramBinarizer.$7($3);
            var $5 = $2[0] & 255;
            var $6 = $2[1] & 255;
            for (var $9 = 1; $9 < $1 - 1; $9++) {
                var $A = $2[$9 + 1] & 255;
                var $B = (($6 << 2) - $5 - $A) >> 1;
                if ($B < $4) {
                    row.set_Renamed($9);
                }
                $5 = $6;
                $6 = $A;
            }
            return row;
        },
        createBinarizer: function(source) {
            return new com.google.zxing.common.GlobalHistogramBinarizer(source);
        },
        $6: function($p0) {
            if (this.$4 == null || this.$4.length < $p0) {
                this.$4 = new Array($p0);
            }
            if (this.$5 == null) {
                this.$5 = new Array(com.google.zxing.common.GlobalHistogramBinarizer.$3);
            } else {
                for (var $0 = 0; $0 < com.google.zxing.common.GlobalHistogramBinarizer.$3; $0++) {
                    this.$5[$0] = 0;
                }
            }
        }
    }
    com.google.zxing.common.GridSampler = function() {}
    com.google.zxing.common.GridSampler.get_instance = function() {
        return com.google.zxing.common.GridSampler.$0;
    }
    com.google.zxing.common.GridSampler.setGridSampler = function(newGridSampler) {
        if (newGridSampler == null) {
            throw new Error('ArgumentException');
        }
        com.google.zxing.common.GridSampler.$0 = newGridSampler;
    }
    com.google.zxing.common.GridSampler.checkAndNudgePoints = function(image, points) {
        var $0 = image.get_width();
        var $1 = image.get_height();
        var $2 = true;
        for (var $3 = 0; $3 < points.length && $2; $3 += 2) {
            var $4 = Math.floor(points[$3]);
            var $5 = Math.floor(points[$3 + 1]);
            if ($4 < -1 || $4 > $0 || $5 < -1 || $5 > $1) {
                throw new Error('ReaderException');
            }
            $2 = false;
            if ($4 === -1) {
                points[$3] = 0;
                $2 = true;
            } else if ($4 === $0) {
                points[$3] = $0 - 1;
                $2 = true;
            }
            if ($5 === -1) {
                points[$3 + 1] = 0;
                $2 = true;
            } else if ($5 === $1) {
                points[$3 + 1] = $1 - 1;
                $2 = true;
            }
        }
        $2 = true;
        for (var $6 = points.length - 2; $6 >= 0 && $2; $6 -= 2) {
            var $7 = Math.floor(points[$6]);
            var $8 = Math.floor(points[$6 + 1]);
            if ($7 < -1 || $7 > $0 || $8 < -1 || $8 > $1) {
                throw new Error('ReaderException');
            }
            $2 = false;
            if ($7 === -1) {
                points[$6] = 0;
                $2 = true;
            } else if ($7 === $0) {
                points[$6] = $0 - 1;
                $2 = true;
            }
            if ($8 === -1) {
                points[$6 + 1] = 0;
                $2 = true;
            } else if ($8 === $1) {
                points[$6 + 1] = $1 - 1;
                $2 = true;
            }
        }
    }
    com.google.zxing.common.GridSampler.prototype = {
        sampleGrid2: function(image, dimension, transform) {
            throw new Error('NotSupportedException');
        }
    }
    com.google.zxing.common.HybridBinarizer = function(source) {
        com.google.zxing.common.HybridBinarizer.initializeBase(this, [source]);
    }
    com.google.zxing.common.HybridBinarizer.$B = function($p0, $p1, $p2, $p3, $p4, $p5) {
        for (var $0 = 0; $0 < $p2; $0++) {
            for (var $1 = 0; $1 < $p1; $1++) {
                var $2 = ($1 > 1) ? $1 : 2;
                $2 = ($2 < $p1 - 2) ? $2 : $p1 - 3;
                var $3 = ($0 > 1) ? $0 : 2;
                $3 = ($3 < $p2 - 2) ? $3 : $p2 - 3;
                var $4 = 0;
                for (var $6 = -2; $6 <= 2; $6++) {
                    var $7 = $p4[$3 + $6];
                    $4 += $7[$2 - 2];
                    $4 += $7[$2 - 1];
                    $4 += $7[$2];
                    $4 += $7[$2 + 1];
                    $4 += $7[$2 + 2];
                }
                var $5 = Math.floor($4 / 25);
                com.google.zxing.common.HybridBinarizer.$C($p0, $1 << 3, $0 << 3, $5, $p3, $p5);
            }
        }
    }
    com.google.zxing.common.HybridBinarizer.$C = function($p0, $p1, $p2, $p3, $p4, $p5) {
        for (var $0 = 0; $0 < 8; $0++) {
            var $1 = ($p2 + $0) * $p4 + $p1;
            for (var $2 = 0; $2 < 8; $2++) {
                var $3 = $p0[$1 + $2] & 255;
                if ($3 < $p3) {
                    $p5.set_Renamed($p1 + $2, $p2 + $0);
                }
            }
        }
    }
    com.google.zxing.common.HybridBinarizer.$D = function($p0, $p1, $p2, $p3) {
        var $0 = new Array($p2);
        for (var $1 = 0; $1 < $p2; $1++) {
            $0[$1] = new Array($p1);
        }
        for (var $2 = 0; $2 < $p2; $2++) {
            for (var $3 = 0; $3 < $p1; $3++) {
                var $4 = 0;
                var $5 = 255;
                var $6 = 0;
                for (var $8 = 0; $8 < 8; $8++) {
                    var $9 = (($2 << 3) + $8) * $p3 + ($3 << 3);
                    for (var $A = 0; $A < 8; $A++) {
                        var $B = $p0[$9 + $A] & 255;
                        $4 += $B;
                        if ($B < $5) {
                            $5 = $B;
                        }
                        if ($B > $6) {
                            $6 = $B;
                        }
                    }
                }
                var $7 = ($6 - $5 > 24) ? ($4 >> 6) : ($5 >> 1);
                $0[$2][$3] = $7;
            }
        }
        return $0;
    }
    com.google.zxing.common.HybridBinarizer.prototype = {
        get_blackMatrix: function() {
            this.$A();
            return this.$9;
        },
        $9: null,
        createBinarizer: function(source) {
            return new com.google.zxing.common.HybridBinarizer(source);
        },
        $A: function() {
            if (this.$9 == null) {
                var $0 = this.get_luminanceSource();
                if ($0.get_width() >= 40 && $0.get_height() >= 40) {
                    var $1 = $0.get_matrix();
                    var $2 = $0.get_width();
                    var $3 = $0.get_height();
                    var $4 = $2 >> 3;
                    var $5 = $3 >> 3;
                    var $6 = com.google.zxing.common.HybridBinarizer.$D($1, $4, $5, $2);
                    this.$9 = new com.google.zxing.common.BitMatrix($2, $3);
                    com.google.zxing.common.HybridBinarizer.$B($1, $4, $5, $2, $6, this.$9);
                } else {
                    this.$9 = com.google.zxing.common.HybridBinarizer.callBaseMethod(this, 'get_blackMatrix');
                }
            }
        }
    }
    com.google.zxing.common.PerspectiveTransform = function(a11, a21, a31, a12, a22, a32, a13, a23, a33) {
        this.$0 = a11;
        this.$1 = a12;
        this.$2 = a13;
        this.$3 = a21;
        this.$4 = a22;
        this.$5 = a23;
        this.$6 = a31;
        this.$7 = a32;
        this.$8 = a33;
    }
    com.google.zxing.common.PerspectiveTransform.quadrilateralToQuadrilateral = function(x0, y0, x1, y1, x2, y2, x3, y3, x0p, y0p, x1p, y1p, x2p, y2p, x3p, y3p) {
        var $0 = com.google.zxing.common.PerspectiveTransform.quadrilateralToSquare(x0, y0, x1, y1, x2, y2, x3, y3);
        var $1 = com.google.zxing.common.PerspectiveTransform.squareToQuadrilateral(x0p, y0p, x1p, y1p, x2p, y2p, x3p, y3p);
        return $1.$A($0);
    }
    com.google.zxing.common.PerspectiveTransform.squareToQuadrilateral = function(x0, y0, x1, y1, x2, y2, x3, y3) {
        var $0 = y3 - y2;
        var $1 = y0 - y1 + y2 - y3;
        if ($0 === 0 && $1 === 0) {
            return new com.google.zxing.common.PerspectiveTransform(x1 - x0, x2 - x1, x0, y1 - y0, y2 - y1, y0, 0, 0, 1);
        } else {
            var $2 = x1 - x2;
            var $3 = x3 - x2;
            var $4 = x0 - x1 + x2 - x3;
            var $5 = y1 - y2;
            var $6 = $2 * $0 - $3 * $5;
            var $7 = ($4 * $0 - $3 * $1) / $6;
            var $8 = ($2 * $1 - $4 * $5) / $6;
            return new com.google.zxing.common.PerspectiveTransform(x1 - x0 + $7 * x1, x3 - x0 + $8 * x3, x0, y1 - y0 + $7 * y1, y3 - y0 + $8 * y3, y0, $7, $8, 1);
        }
    }
    com.google.zxing.common.PerspectiveTransform.quadrilateralToSquare = function(x0, y0, x1, y1, x2, y2, x3, y3) {
        return com.google.zxing.common.PerspectiveTransform.squareToQuadrilateral(x0, y0, x1, y1, x2, y2, x3, y3).$9();
    }
    com.google.zxing.common.PerspectiveTransform.prototype = {
        $0: 0,
        $1: 0,
        $2: 0,
        $3: 0,
        $4: 0,
        $5: 0,
        $6: 0,
        $7: 0,
        $8: 0,
        transformPoints1: function(points) {
            var $0 = points.length;
            var $1 = this.$0;
            var $2 = this.$1;
            var $3 = this.$2;
            var $4 = this.$3;
            var $5 = this.$4;
            var $6 = this.$5;
            var $7 = this.$6;
            var $8 = this.$7;
            var $9 = this.$8;
            for (var $A = 0; $A < $0; $A += 2) {
                var $B = points[$A];
                var $C = points[$A + 1];
                var $D = $3 * $B + $6 * $C + $9;
                points[$A] = ($1 * $B + $4 * $C + $7) / $D;
                points[$A + 1] = ($2 * $B + $5 * $C + $8) / $D;
            }
        },
        transformPoints2: function(xValues, yValues) {
            var $0 = xValues.length;
            for (var $1 = 0; $1 < $0; $1++) {
                var $2 = xValues[$1];
                var $3 = yValues[$1];
                var $4 = this.$2 * $2 + this.$5 * $3 + this.$8;
                xValues[$1] = (this.$0 * $2 + this.$3 * $3 + this.$6) / $4;
                yValues[$1] = (this.$1 * $2 + this.$4 * $3 + this.$7) / $4;
            }
        },
        $9: function() {
            return new com.google.zxing.common.PerspectiveTransform(this.$4 * this.$8 - this.$5 * this.$7, this.$5 * this.$6 - this.$3 * this.$8, this.$3 * this.$7 - this.$4 * this.$6, this.$2 * this.$7 - this.$1 * this.$8, this.$0 * this.$8 - this.$2 * this.$6, this.$1 * this.$6 - this.$0 * this.$7, this.$1 * this.$5 - this.$2 * this.$4, this.$2 * this.$3 - this.$0 * this.$5, this.$0 * this.$4 - this.$1 * this.$3);
        },
        $A: function($p0) {
            return new com.google.zxing.common.PerspectiveTransform(this.$0 * $p0.$0 + this.$3 * $p0.$1 + this.$6 * $p0.$2, this.$0 * $p0.$3 + this.$3 * $p0.$4 + this.$6 * $p0.$5, this.$0 * $p0.$6 + this.$3 * $p0.$7 + this.$6 * $p0.$8, this.$1 * $p0.$0 + this.$4 * $p0.$1 + this.$7 * $p0.$2, this.$1 * $p0.$3 + this.$4 * $p0.$4 + this.$7 * $p0.$5, this.$1 * $p0.$6 + this.$4 * $p0.$7 + this.$7 * $p0.$8, this.$2 * $p0.$0 + this.$5 * $p0.$1 + this.$8 * $p0.$2, this.$2 * $p0.$3 + this.$5 * $p0.$4 + this.$8 * $p0.$5, this.$2 * $p0.$6 + this.$5 * $p0.$7 + this.$8 * $p0.$8);
        }
    }
    Type.registerNamespace('com.google.zxing.common.detector');
    com.google.zxing.common.detector.MonochromeRectangleDetector = function(image) {
        this.$1 = image;
    }
    com.google.zxing.common.detector.MonochromeRectangleDetector.prototype = {
        $1: null,
        detect: function() {
            var $0 = this.$1.get_height();
            var $1 = this.$1.get_width();
            var $2 = $0 >> 1;
            var $3 = $1 >> 1;
            var $4 = Math.max(1, Math.floor($0 / (32 << 3)));
            var $5 = Math.max(1, Math.floor($1 / (32 << 3)));
            var $6 = 0;
            var $7 = $0;
            var $8 = 0;
            var $9 = $1;
            var $A = this.$2($3, 0, $8, $9, $2, -$4, $6, $7, $3 >> 1);
            $6 = Math.floor($A.get_y()) - 1;
            var $B = this.$2($3, -$5, $8, $9, $2, 0, $6, $7, $2 >> 1);
            $8 = Math.floor($B.get_x()) - 1;
            var $C = this.$2($3, $5, $8, $9, $2, 0, $6, $7, $2 >> 1);
            $9 = Math.floor($C.get_x()) + 1;
            var $D = this.$2($3, 0, $8, $9, $2, $4, $6, $7, $3 >> 1);
            $7 = Math.floor($D.get_y()) + 1;
            $A = this.$2($3, 0, $8, $9, $2, -$4, $6, $7, $3 >> 2);
            return [$A, $B, $C, $D];
        },
        $2: function($p0, $p1, $p2, $p3, $p4, $p5, $p6, $p7, $p8) {
            var $0 = null;
            for (var $1 = $p4, $2 = $p0; $1 < $p7 && $1 >= $p6 && $2 < $p3 && $2 >= $p2; $1 += $p5, $2 += $p1) {
                var $3;
                if (!$p1) {
                    $3 = this.$3($1, $p8, $p2, $p3, true);
                } else {
                    $3 = this.$3($2, $p8, $p6, $p7, false);
                }
                if ($3 == null) {
                    if ($0 == null) {
                        throw new Error('ReaderException');
                    }
                    if (!$p1) {
                        var $4 = $1 - $p5;
                        if ($0[0] < $p0) {
                            if ($0[1] > $p0) {
                                return new com.google.zxing.ResultPoint(($p5 > 0) ? $0[0] : $0[1], $4);
                            }
                            return new com.google.zxing.ResultPoint($0[0], $4);
                        } else {
                            return new com.google.zxing.ResultPoint($0[1], $4);
                        }
                    } else {
                        var $5 = $2 - $p1;
                        if ($0[0] < $p4) {
                            if ($0[1] > $p4) {
                                return new com.google.zxing.ResultPoint($5, ($p1 < 0) ? $0[0] : $0[1]);
                            }
                            return new com.google.zxing.ResultPoint($5, $0[0]);
                        } else {
                            return new com.google.zxing.ResultPoint($5, $0[1]);
                        }
                    }
                }
                $0 = $3;
            }
            throw new Error('ReaderException');
        },
        $3: function($p0, $p1, $p2, $p3, $p4) {
            var $0 = ($p2 + $p3) >> 1;
            var $1 = $0;
            while ($1 >= $p2) {
                if (($p4) ? this.$1.get_Renamed($1, $p0) : this.$1.get_Renamed($p0, $1)) {
                    $1--;
                } else {
                    var $3 = $1;
                    do {
                        $1--;
                    } while ($1 >= $p2 && !(($p4) ? this.$1.get_Renamed($1, $p0) : this.$1.get_Renamed($p0, $1)));
                    var $4 = $3 - $1;
                    if ($1 < $p2 || $4 > $p1) {
                        $1 = $3;
                        break;
                    }
                }
            }
            $1++;
            var $2 = $0;
            while ($2 < $p3) {
                if (($p4) ? this.$1.get_Renamed($2, $p0) : this.$1.get_Renamed($p0, $2)) {
                    $2++;
                } else {
                    var $5 = $2;
                    do {
                        $2++;
                    } while ($2 < $p3 && !(($p4) ? this.$1.get_Renamed($2, $p0) : this.$1.get_Renamed($p0, $2)));
                    var $6 = $2 - $5;
                    if ($2 >= $p3 || $6 > $p1) {
                        $2 = $5;
                        break;
                    }
                }
            }
            $2--;
            return ($2 > $1) ? [$1, $2] : null;
        }
    }
    Type.registerNamespace('com.google.zxing.common.reedsolomon');
    com.google.zxing.common.reedsolomon.GF256 = function(primitive) {
        this.$2 = new Array(256);
        this.$3 = new Array(256);
        var $0 = 1;
        for (var $1 = 0; $1 < 256; $1++) {
            this.$2[$1] = $0;
            $0 <<= 1;
            if ($0 >= 256) {
                $0 ^= primitive;
            }
        }
        for (var $2 = 0; $2 < 255; $2++) {
            this.$3[this.$2[$2]] = $2;
        }
        this.$4 = new com.google.zxing.common.reedsolomon.ZXingQR$5(this, [0]);
        this.$5 = new com.google.zxing.common.reedsolomon.ZXingQR$5(this, [1]);
    }
    com.google.zxing.common.reedsolomon.GF256.$7 = function($p0, $p1) {
        return $p0 ^ $p1;
    }
    com.google.zxing.common.reedsolomon.GF256.prototype = {
        get_$0: function() {
            return this.$4;
        },
        get_$1: function() {
            return this.$5;
        },
        $2: null,
        $3: null,
        $4: null,
        $5: null,
        $6: function($p0, $p1) {
            if ($p0 < 0) {
                throw new Error('ArgumentException');
            }
            if (!$p1) {
                return this.$4;
            }
            var $0 = new Array($p0 + 1);
            $0[0] = $p1;
            return new com.google.zxing.common.reedsolomon.ZXingQR$5(this, $0);
        },
        $8: function($p0) {
            return this.$2[$p0];
        },
        $9: function($p0) {
            if (!$p0) {
                throw new Error('ArgumentException');
            }
            return this.$3[$p0];
        },
        $A: function($p0) {
            if (!$p0) {
                throw new Error('ArithmeticException');
            }
            return this.$2[255 - this.$3[$p0]];
        },
        $B: function($p0, $p1) {
            if (!$p0 || !$p1) {
                return 0;
            }
            if ($p0 === 1) {
                return $p1;
            }
            if ($p1 === 1) {
                return $p0;
            }
            return this.$2[(this.$3[$p0] + this.$3[$p1]) % 255];
        }
    }
    com.google.zxing.common.reedsolomon.ZXingQR$5 = function(field, coefficients) {
        if (coefficients == null || !coefficients.length) {
            throw new Error('ArgumentException');
        }
        this.$3 = field;
        var $0 = coefficients.length;
        if ($0 > 1 && !coefficients[0]) {
            var $1 = 1;
            while ($1 < $0 && !coefficients[$1]) {
                $1++;
            }
            if ($1 === $0) {
                this.$4 = field.get_$0().$4;
            } else {
                this.$4 = new Array($0 - $1);
                SystemExtend.ArrayExtend.copy(coefficients, $1, this.$4, 0, this.$4.length);
            }
        } else {
            this.$4 = coefficients;
        }
    }
    com.google.zxing.common.reedsolomon.ZXingQR$5.prototype = {
        get_$0: function() {
            return this.$4;
        },
        get_$1: function() {
            return this.$4.length - 1;
        },
        get_$2: function() {
            return !this.$4[0];
        },
        $3: null,
        $4: null,
        $5: function($p0) {
            return this.$4[this.$4.length - 1 - $p0];
        },
        $6: function($p0) {
            if (!$p0) {
                return this.$5(0);
            }
            var $0 = this.$4.length;
            if ($p0 === 1) {
                var $2 = 0;
                for (var $3 = 0; $3 < $0; $3++) {
                    $2 = com.google.zxing.common.reedsolomon.GF256.$7($2, this.$4[$3]);
                }
                return $2;
            }
            var $1 = this.$4[0];
            for (var $4 = 1; $4 < $0; $4++) {
                $1 = com.google.zxing.common.reedsolomon.GF256.$7(this.$3.$B($p0, $1), this.$4[$4]);
            }
            return $1;
        },
        $7: function($p0) {
            if (!(this.$3 === $p0.$3)) {
                throw new Error('GF256Polys do not have same GF256 field');
            }
            if (this.get_$2()) {
                return $p0;
            }
            if ($p0.get_$2()) {
                return this;
            }
            var $0 = this.$4;
            var $1 = $p0.$4;
            if ($0.length > $1.length) {
                var $4 = $0;
                $0 = $1;
                $1 = $4;
            }
            var $2 = new Array($1.length);
            var $3 = $1.length - $0.length;
            SystemExtend.ArrayExtend.copy($1, 0, $2, 0, $3);
            for (var $5 = $3; $5 < $1.length; $5++) {
                $2[$5] = com.google.zxing.common.reedsolomon.GF256.$7($0[$5 - $3], $1[$5]);
            }
            return new com.google.zxing.common.reedsolomon.ZXingQR$5(this.$3, $2);
        },
        $8: function($p0) {
            if (!(this.$3 === $p0.$3)) {
                throw new Error('GF256Polys do not have same GF256 field');
            }
            if (this.get_$2() || $p0.get_$2()) {
                return this.$3.get_$0();
            }
            var $0 = this.$4;
            var $1 = $0.length;
            var $2 = $p0.$4;
            var $3 = $2.length;
            var $4 = new Array($1 + $3 - 1);
            for (var $5 = 0; $5 < $1; $5++) {
                var $6 = $0[$5];
                for (var $7 = 0; $7 < $3; $7++) {
                    $4[$5 + $7] = com.google.zxing.common.reedsolomon.GF256.$7($4[$5 + $7], this.$3.$B($6, $2[$7]));
                }
            }
            return new com.google.zxing.common.reedsolomon.ZXingQR$5(this.$3, $4);
        },
        $9: function($p0) {
            if (!$p0) {
                return this.$3.get_$0();
            }
            if ($p0 === 1) {
                return this;
            }
            var $0 = this.$4.length;
            var $1 = new Array($0);
            for (var $2 = 0; $2 < $0; $2++) {
                $1[$2] = this.$3.$B(this.$4[$2], $p0);
            }
            return new com.google.zxing.common.reedsolomon.ZXingQR$5(this.$3, $1);
        },
        $A: function($p0, $p1) {
            if ($p0 < 0) {
                throw new Error('ArgumentException');
            }
            if (!$p1) {
                return this.$3.get_$0();
            }
            var $0 = this.$4.length;
            var $1 = new Array($0 + $p0);
            for (var $2 = 0; $2 < $0; $2++) {
                $1[$2] = this.$3.$B(this.$4[$2], $p1);
            }
            return new com.google.zxing.common.reedsolomon.ZXingQR$5(this.$3, $1);
        },
        $B: function($p0) {
            if (!(this.$3 === $p0.$3)) {
                throw new Error('GF256Polys do not have same GF256 field');
            }
            if ($p0.get_$2()) {
                throw new Error('Divide by 0');
            }
            var $0 = this.$3.get_$0();
            var $1 = this;
            var $2 = $p0.$5($p0.get_$1());
            var $3 = this.$3.$A($2);
            while ($1.get_$1() >= $p0.get_$1() && !$1.get_$2()) {
                var $4 = $1.get_$1() - $p0.get_$1();
                var $5 = this.$3.$B($1.$5($1.get_$1()), $3);
                var $6 = $p0.$A($4, $5);
                var $7 = this.$3.$6($4, $5);
                $0 = $0.$7($7);
                $1 = $1.$7($6);
            }
            return [$0, $1];
        },
        toString: function() {
            var $0 = new ss.StringBuilder();
            for (var $1 = this.get_$1(); $1 >= 0; $1--) {
                var $2 = this.$5($1);
                if (!!$2) {
                    if ($2 < 0) {
                        $0.append(' - ');
                        $2 = -$2;
                    } else {
                        if ($0.toString().length > 0) {
                            $0.append(' + ');
                        }
                    }
                    if (!$1 || $2 !== 1) {
                        var $3 = this.$3.$9($2);
                        if (!$3) {
                            $0.append('1');
                        } else if ($3 === 1) {
                            $0.append('a');
                        } else {
                            $0.append('a^');
                            $0.append($3);
                        }
                    }
                    if (!!$1) {
                        if ($1 === 1) {
                            $0.append('x');
                        } else {
                            $0.append('x^');
                            $0.append($1);
                        }
                    }
                }
            }
            return $0.toString();
        }
    }
    com.google.zxing.common.reedsolomon.ReedSolomonDecoder = function(field) {
        this.$0 = field;
    }
    com.google.zxing.common.reedsolomon.ReedSolomonDecoder.prototype = {
        $0: null,
        decode: function(received, twoS) {
            var $0 = new com.google.zxing.common.reedsolomon.ZXingQR$5(this.$0, received);
            var $1 = new Array(twoS);
            var $2 = this.$0 === com.google.zxing.common.reedsolomon.GF256.datA_MATRIX_FIELD;
            var $3 = true;
            for (var $A = 0; $A < twoS; $A++) {
                var $B = $0.$6(this.$0.$8(($2) ? $A + 1 : $A));
                $1[$1.length - 1 - $A] = $B;
                if (!!$B) {
                    $3 = false;
                }
            }
            if ($3) {
                return;
            }
            var $4 = new com.google.zxing.common.reedsolomon.ZXingQR$5(this.$0, $1);
            var $5 = this.$1(this.$0.$6(twoS, 1), $4, twoS);
            var $6 = $5[0];
            var $7 = $5[1];
            var $8 = this.$2($6);
            var $9 = this.$3($7, $8, $2);
            for (var $C = 0; $C < $8.length; $C++) {
                var $D = received.length - 1 - this.$0.$9($8[$C]);
                if ($D < 0) {
                    throw new Error('ReedSolomonException: Bad error location');
                }
                received[$D] = com.google.zxing.common.reedsolomon.GF256.$7(received[$D], $9[$C]);
            }
        },
        $1: function($p0, $p1, $p2) {
            if ($p0.get_$1() < $p1.get_$1()) {
                var $A = $p0;
                $p0 = $p1;
                $p1 = $A;
            }
            var $0 = $p0;
            var $1 = $p1;
            var $2 = this.$0.get_$1();
            var $3 = this.$0.get_$0();
            var $4 = this.$0.get_$0();
            var $5 = this.$0.get_$1();
            while ($1.get_$1() >= Math.floor($p2 / 2)) {
                var $B = $0;
                var $C = $2;
                var $D = $4;
                $0 = $1;
                $2 = $3;
                $4 = $5;
                if ($0.get_$2()) {
                    throw new Error('ReedSolomonException: r_{i-1} was zero');
                }
                $1 = $B;
                var $E = this.$0.get_$0();
                var $F = $0.$5($0.get_$1());
                var $10 = this.$0.$A($F);
                while ($1.get_$1() >= $0.get_$1() && !$1.get_$2()) {
                    var $11 = $1.get_$1() - $0.get_$1();
                    var $12 = this.$0.$B($1.$5($1.get_$1()), $10);
                    $E = $E.$7(this.$0.$6($11, $12));
                    $1 = $1.$7($0.$A($11, $12));
                }
                $3 = $E.$8($2).$7($C);
                $5 = $E.$8($4).$7($D);
            }
            var $6 = $5.$5(0);
            if (!$6) {
                throw new Error('ReedSolomonException: sigmaTilde(0) was zero');
            }
            var $7 = this.$0.$A($6);
            var $8 = $5.$9($7);
            var $9 = $1.$9($7);
            return [$8, $9];
        },
        $2: function($p0) {
            var $0 = $p0.get_$1();
            if ($0 === 1) {
                return [$p0.$5(1)];
            }
            var $1 = new Array($0);
            var $2 = 0;
            for (var $3 = 1; $3 < 256 && $2 < $0; $3++) {
                if (!$p0.$6($3)) {
                    $1[$2] = this.$0.$A($3);
                    $2++;
                }
            }
            if ($2 !== $0) {
                throw new Error('ReedSolomonException: Error locator degree does not match number of roots');
            }
            return $1;
        },
        $3: function($p0, $p1, $p2) {
            var $0 = $p1.length;
            var $1 = new Array($0);
            for (var $2 = 0; $2 < $0; $2++) {
                var $3 = this.$0.$A($p1[$2]);
                var $4 = 1;
                for (var $5 = 0; $5 < $0; $5++) {
                    if ($2 !== $5) {
                        $4 = this.$0.$B($4, com.google.zxing.common.reedsolomon.GF256.$7(1, this.$0.$B($p1[$5], $3)));
                    }
                }
                $1[$2] = this.$0.$B($p0.$6($3), this.$0.$A($4));
                if ($p2) {
                    $1[$2] = this.$0.$B($1[$2], $3);
                }
            }
            return $1;
        }
    }
    com.google.zxing.common.reedsolomon.ReedSolomonEncoder = function(field) {
        if (!(com.google.zxing.common.reedsolomon.GF256.qR_CODE_FIELD === field)) {
            throw new Error('Only QR Code is supported at this time');
        }
        this.$0 = field;
        this.$1 = new Array(10);
        this.$1.add(new com.google.zxing.common.reedsolomon.ZXingQR$5(field, [1]));
    }
    com.google.zxing.common.reedsolomon.ReedSolomonEncoder.prototype = {
        $0: null,
        $1: null,
        $2: function($p0) {
            if ($p0 >= this.$1.length) {
                var $0 = this.$1[this.$1.length - 1];
                for (var $1 = this.$1.length; $1 <= $p0; $1++) {
                    var $2 = $0.$8(new com.google.zxing.common.reedsolomon.ZXingQR$5(this.$0, [1, this.$0.$8($1 - 1)]));
                    this.$1.add($2);
                    $0 = $2;
                }
            }
            return this.$1[$p0];
        },
        encode: function(toEncode, ecBytes) {
            if (!ecBytes) {
                throw new Error('No error correction bytes');
            }
            var $0 = toEncode.length - ecBytes;
            if ($0 <= 0) {
                throw new Error('No data bytes provided');
            }
            var $1 = this.$2(ecBytes);
            var $2 = new Array($0);
            SystemExtend.ArrayExtend.copy(toEncode, 0, $2, 0, $0);
            var $3 = new com.google.zxing.common.reedsolomon.ZXingQR$5(this.$0, $2);
            $3 = $3.$A(ecBytes, 1);
            var $4 = $3.$B($1)[1];
            var $5 = $4.get_$0();
            var $6 = ecBytes - $5.length;
            for (var $7 = 0; $7 < $6; $7++) {
                toEncode[$0 + $7] = 0;
            }
            SystemExtend.ArrayExtend.copy($5, 0, toEncode, $0 + $6, $5.length);
        }
    }
    Type.registerNamespace('com.google.zxing.oned');
    com.google.zxing.oned.OneDReader = function() {}
    com.google.zxing.oned.OneDReader.$3 = function($p0, $p1, $p2) {
        var $0 = $p2.length;
        for (var $5 = 0; $5 < $0; $5++) {
            $p2[$5] = 0;
        }
        var $1 = $p0.get_size();
        if ($p1 >= $1) {
            throw new Error('ReaderException');
        }
        var $2 = !$p0.get_Renamed($p1);
        var $3 = 0;
        var $4 = $p1;
        while ($4 < $1) {
            var $6 = $p0.get_Renamed($4);
            if (($6 ^ $2) === 1) {
                $p2[$3]++;
            } else {
                $3++;
                if ($3 === $0) {
                    break;
                } else {
                    $p2[$3] = 1;
                    $2 = ($2 ^ true) === 1;
                }
            }
            $4++;
        }
        if (!($3 === $0 || ($3 === $0 - 1 && $4 === $1))) {
            throw new Error('ReaderException');
        }
    }
    com.google.zxing.oned.OneDReader.$4 = function($p0, $p1, $p2) {
        var $0 = $p0.length;
        var $1 = 0;
        var $2 = 0;
        for (var $5 = 0; $5 < $0; $5++) {
            $1 += $p0[$5];
            $2 += $p1[$5];
        }
        if ($1 < $2) {
            return SystemExtend.Int32Extend.maxValue;
        }
        var $3 = Math.floor(($1 << 8) / $2);
        $p2 = ($p2 * $3) >> 8;
        var $4 = 0;
        for (var $6 = 0; $6 < $0; $6++) {
            var $7 = $p0[$6] << 8;
            var $8 = $p1[$6] * $3;
            var $9 = ($7 > $8) ? $7 - $8 : $8 - $7;
            if ($9 > $p2) {
                return SystemExtend.Int32Extend.maxValue;
            }
            $4 += $9;
        }
        return Math.floor($4 / $1);
    }
    com.google.zxing.oned.OneDReader.prototype = {
        decode1: function(image) {
            return this.decode2(image, null);
        },
        decode2: function(image, hints) {
            try {
                return this.$2(image, hints);
            } catch ($0) {
                if ($0.message.indexOf('ReaderException') < 0) {
                    throw $0;
                }
                var $1 = hints != null && Object.keyExists(hints, com.google.zxing.DecodeHintType.trY_HARDER);
                if ($1 && image.get_rotateSupported()) {
                    var $2 = image.rotateCounterClockwise();
                    var $3 = this.$2($2, hints);
                    var $4 = $3.get_resultMetadata();
                    var $5 = 270;
                    if ($4 != null && Object.keyExists($4, com.google.zxing.ResultMetadataType.ORIENTATION)) {
                        $5 = ($5 + ($4[com.google.zxing.ResultMetadataType.ORIENTATION])) % 360;
                    }
                    $3.putMetadata(com.google.zxing.ResultMetadataType.ORIENTATION, $5);
                    var $6 = $3.get_resultPoints();
                    var $7 = $2.get_height();
                    for (var $8 = 0; $8 < $6.length; $8++) {
                        $6[$8] = new com.google.zxing.ResultPoint($7 - $6[$8].get_y() - 1, $6[$8].get_x());
                    }
                    return $3;
                } else {
                    throw $0;
                }
            }
        },
        $2: function($p0, $p1) {
            var $0 = $p0.get_width();
            var $1 = $p0.get_height();
            var $2 = new com.google.zxing.common.BitArray($0);
            var $3 = $1 >> 1;
            var $4 = $p1 != null && Object.keyExists($p1, com.google.zxing.DecodeHintType.trY_HARDER);
            var $5 = Math.max(1, $1 >> (($4) ? 7 : 4));
            var $6;
            if ($4) {
                $6 = $1;
            } else {
                $6 = 9;
            }
            for (var $7 = 0; $7 < $6; $7++) {
                var $8 = ($7 + 1) >> 1;
                var $9 = !($7 & 1);
                var $A = $3 + $5 * (($9) ? $8 : -$8);
                if ($A < 0 || $A >= $1) {
                    break;
                }
                try {
                    $2 = $p0.getBlackRow($A, $2);
                } catch ($B) {
                    if ($B.message.indexOf('ReaderException') < 0) {
                        throw $B;
                    }
                    continue;
                }
                for (var $C = 0; $C < 2; $C++) {
                    if ($C === 1) {
                        $2.reverse();
                        if ($p1 != null && Object.keyExists($p1, com.google.zxing.DecodeHintType.neeD_RESULT_POINT_CALLBACK)) {
                            var $D = {};
                            var $E = Object.keys($p1).getEnumerator();
                            while ($E.moveNext()) {
                                var $F = $E.current;
                                if (!($F === com.google.zxing.DecodeHintType.neeD_RESULT_POINT_CALLBACK)) {
                                    $D[$F] = $p1[$F];
                                }
                            }
                            $p1 = $D;
                        }
                    }
                    try {
                        var $10 = this.decodeRow2($A, $2, $p1);
                        if ($C === 1) {
                            $10.putMetadata(com.google.zxing.ResultMetadataType.ORIENTATION, 180);
                            var $11 = $10.get_resultPoints();
                            $11[0] = new com.google.zxing.ResultPoint($0 - $11[0].get_x() - 1, $11[0].get_y());
                            $11[1] = new com.google.zxing.ResultPoint($0 - $11[1].get_x() - 1, $11[1].get_y());
                        }
                        return $10;
                    } catch ($12) {
                        if ($12.message.indexOf('ReaderException') < 0) {
                            throw $12;
                        }
                    }
                }
            }
            throw new Error('ReaderException');
        }
    }
    com.google.zxing.oned.UPCEANReader = function() {
        com.google.zxing.oned.UPCEANReader.initializeBase(this);
        this.$C = new ss.StringBuilder();
    }
    com.google.zxing.oned.UPCEANReader.$D = function($p0) {
        var $0 = false;
        var $1 = null;
        var $2 = 0;
        while (!$0) {
            $1 = com.google.zxing.oned.UPCEANReader.$F($p0, $2, false, com.google.zxing.oned.UPCEANReader.$8);
            var $3 = $1[0];
            $2 = $1[1];
            var $4 = $3 - ($2 - $3);
            if ($4 >= 0) {
                $0 = $p0.isRange($4, $3, false);
            }
        }
        return $1;
    }
    com.google.zxing.oned.UPCEANReader.$E = function($p0) {
        var $0 = $p0.length;
        if (!$0) {
            return false;
        }
        var $1 = 0;
        for (var $2 = $0 - 2; $2 >= 0; $2 -= 2) {
            var $3 = $p0.charCodeAt($2) - SystemExtend.CharExtend.toInt32('0');
            if ($3 < 0 || $3 > 9) {
                throw new Error('ReaderException');
            }
            $1 += $3;
        }
        $1 *= 3;
        for (var $4 = $0 - 1; $4 >= 0; $4 -= 2) {
            var $5 = $p0.charCodeAt($4) - SystemExtend.CharExtend.toInt32('0');
            if ($5 < 0 || $5 > 9) {
                throw new Error('ReaderException');
            }
            $1 += $5;
        }
        return !($1 % 10);
    }
    com.google.zxing.oned.UPCEANReader.$F = function($p0, $p1, $p2, $p3) {
        var $0 = $p3.length;
        var $1 = new Array($0);
        var $2 = $p0.get_size();
        var $3 = false;
        while ($p1 < $2) {
            $3 = !$p0.get_Renamed($p1);
            if ($p2 === $3) {
                break;
            }
            $p1++;
        }
        var $4 = 0;
        var $5 = $p1;
        for (var $6 = $p1; $6 < $2; $6++) {
            var $7 = $p0.get_Renamed($6);
            if (($7 ^ $3) === 1) {
                $1[$4]++;
            } else {
                if ($4 === $0 - 1) {
                    if (com.google.zxing.oned.OneDReader.$4($1, $p3, com.google.zxing.oned.UPCEANReader.$7) < com.google.zxing.oned.UPCEANReader.$6) {
                        return [$5, $6];
                    }
                    $5 += $1[0] + $1[1];
                    for (var $8 = 2; $8 < $0; $8++) {
                        $1[$8 - 2] = $1[$8];
                    }
                    $1[$0 - 2] = 0;
                    $1[$0 - 1] = 0;
                    $4--;
                } else {
                    $4++;
                }
                $1[$4] = 1;
                $3 = !$3;
            }
        }
        throw new Error('ReaderException');
    }
    com.google.zxing.oned.UPCEANReader.$10 = function($p0, $p1, $p2, $p3) {
        com.google.zxing.oned.OneDReader.$3($p0, $p2, $p1);
        var $0 = com.google.zxing.oned.UPCEANReader.$6;
        var $1 = -1;
        var $2 = $p3.length;
        for (var $3 = 0; $3 < $2; $3++) {
            var $4 = $p3[$3];
            var $5 = com.google.zxing.oned.OneDReader.$4($p1, $4, com.google.zxing.oned.UPCEANReader.$7);
            if ($5 < $0) {
                $0 = $5;
                $1 = $3;
            }
        }
        if ($1 >= 0) {
            return $1;
        } else {
            throw new Error('ReaderException');
        }
    }
    com.google.zxing.oned.UPCEANReader.prototype = {
        $C: null,
        decodeRow2: function(rowNumber, row, hints) {
            return this.decodeRow1(rowNumber, row, com.google.zxing.oned.UPCEANReader.$D(row), hints);
        },
        decodeRow1: function(rowNumber, row, startGuardRange, hints) {
            var $0 = (hints == null) ? null : hints[com.google.zxing.DecodeHintType.neeD_RESULT_POINT_CALLBACK];
            if ($0 != null) {
                $0.foundPossibleResultPoint(new com.google.zxing.ResultPoint((startGuardRange[0] + startGuardRange[1]) / 2, rowNumber));
            }
            var $1 = this.$C;
            $1.clear();
            var $2 = this.decodeMiddle(row, startGuardRange, $1);
            if ($0 != null) {
                $0.foundPossibleResultPoint(new com.google.zxing.ResultPoint($2, rowNumber));
            }
            var $3 = this.decodeEnd(row, $2);
            if ($0 != null) {
                $0.foundPossibleResultPoint(new com.google.zxing.ResultPoint(($3[0] + $3[1]) / 2, rowNumber));
            }
            var $4 = $3[1];
            var $5 = $4 + ($4 - $3[0]);
            if ($5 >= row.get_size() || !row.isRange($4, $5, false)) {
                throw new Error('ReaderException');
            }
            var $6 = $1.toString();
            if (!this.checkChecksum($6)) {
                throw new Error('ReaderException');
            }
            var $7 = (startGuardRange[1] + startGuardRange[0]) / 2;
            var $8 = ($3[1] + $3[0]) / 2;
            return new com.google.zxing.Result($6, null, [new com.google.zxing.ResultPoint($7, rowNumber), new com.google.zxing.ResultPoint($8, rowNumber)], this.get_$5());
        },
        checkChecksum: function(s) {
            return com.google.zxing.oned.UPCEANReader.$E(s);
        },
        decodeEnd: function(row, endStart) {
            return com.google.zxing.oned.UPCEANReader.$F(row, endStart, false, com.google.zxing.oned.UPCEANReader.$8);
        }
    }
    com.google.zxing.oned.UPCEReader = function() {
        com.google.zxing.oned.UPCEReader.initializeBase(this);
        this.$13 = new Array(4);
    }
    com.google.zxing.oned.UPCEReader.$14 = function($p0, $p1) {
        for (var $0 = 0; $0 <= 1; $0++) {
            for (var $1 = 0; $1 < 10; $1++) {
                if ($p1 === com.google.zxing.oned.UPCEReader.$12[$0][$1]) {
                    var $2 = SystemExtend.Int32Extend.toChar(SystemExtend.CharExtend.toInt32('0') + $0) + $p0.toString() + SystemExtend.Int32Extend.toChar(SystemExtend.CharExtend.toInt32('0') + $1);
                    $p0.clear();
                    $p0.append($2);
                    return;
                }
            }
        }
        throw new Error('ReaderException');
    }
    com.google.zxing.oned.UPCEReader.convertUPCEtoUPCA = function(upce) {
        var $0 = new Array(6);
        SupportClass.getCharsFromString(upce, 1, 7, $0, 0);
        var $1 = new ss.StringBuilder();
        $1.append(upce.charAt(0));
        var $2 = $0[5];
        switch ($2) {
            case '0':
            case '1':
            case '2':
                $1.append($0.extract(0, 2).join());
                $1.append($2);
                $1.append('0000');
                $1.append($0.extract(2, 3).join());
                break;
            case '3':
                $1.append($0.extract(0, 3).join());
                $1.append('00000');
                $1.append($0.extract(3, 2).join());
                break;
            case '4':
                $1.append($0.extract(0, 4).join());
                $1.append('00000');
                $1.append($0[4]);
                break;
            default:
                $1.append($0.extract(0, 5).join());
                $1.append('0000');
                $1.append($2);
                break;
        }
        $1.append(upce.charAt(7));
        return $1.toString();
    }
    com.google.zxing.oned.UPCEReader.prototype = {
        get_$5: function() {
            return com.google.zxing.BarcodeFormat.upC_E;
        },
        $13: null,
        decodeMiddle: function(row, startRange, result) {
            var $0 = this.$13;
            $0[0] = 0;
            $0[1] = 0;
            $0[2] = 0;
            $0[3] = 0;
            var $1 = row.get_size();
            var $2 = startRange[1];
            var $3 = 0;
            for (var $4 = 0; $4 < 6 && $2 < $1; $4++) {
                var $5 = com.google.zxing.oned.UPCEANReader.$10(row, $0, $2, com.google.zxing.oned.UPCEANReader.$B);
                result.append(('0' + $5 % 10));
                for (var $6 = 0; $6 < $0.length; $6++) {
                    $2 += $0[$6];
                }
                if ($5 >= 10) {
                    $3 |= 1 << (5 - $4);
                }
            }
            com.google.zxing.oned.UPCEReader.$14(result, $3);
            return $2;
        },
        decodeEnd: function(row, endStart) {
            return com.google.zxing.oned.UPCEANReader.$F(row, endStart, true, com.google.zxing.oned.UPCEReader.$11);
        },
        checkChecksum: function(s) {
            return com.google.zxing.oned.UPCEReader.callBaseMethod(this, 'checkChecksum', [com.google.zxing.oned.UPCEReader.convertUPCEtoUPCA(s)]);
        }
    }
    Type.registerNamespace('com.google.zxing.qrcode.decoder');
    com.google.zxing.qrcode.decoder.ZXingQR$7 = function(bitMatrix) {
        var $0 = bitMatrix.get_dimension();
        if ($0 < 21 || ($0 & 3) !== 1) {
            throw new Error('ReaderException');
        }
        this.$0 = bitMatrix;
    }
    com.google.zxing.qrcode.decoder.ZXingQR$7.prototype = {
        $0: null,
        $1: null,
        $2: null,
        $3: function() {
            if (this.$2 != null) {
                return this.$2;
            }
            var $0 = 0;
            for (var $3 = 0; $3 < 6; $3++) {
                $0 = this.$5($3, 8, $0);
            }
            $0 = this.$5(7, 8, $0);
            $0 = this.$5(8, 8, $0);
            $0 = this.$5(8, 7, $0);
            for (var $4 = 5; $4 >= 0; $4--) {
                $0 = this.$5(8, $4, $0);
            }
            this.$2 = com.google.zxing.qrcode.decoder.ZXingQR$3.$8($0);
            if (this.$2 != null) {
                return this.$2;
            }
            var $1 = this.$0.get_dimension();
            $0 = 0;
            var $2 = $1 - 8;
            for (var $5 = $1 - 1; $5 >= $2; $5--) {
                $0 = this.$5($5, 8, $0);
            }
            for (var $6 = $1 - 7; $6 < $1; $6++) {
                $0 = this.$5(8, $6, $0);
            }
            this.$2 = com.google.zxing.qrcode.decoder.ZXingQR$3.$8($0);
            if (this.$2 != null) {
                return this.$2;
            }
            throw new Error('ReaderException');
        },
        $4: function() {
            if (this.$1 != null) {
                return this.$1;
            }
            var $0 = this.$0.get_dimension();
            var $1 = ($0 - 17) >> 2;
            if ($1 <= 6) {
                return com.google.zxing.qrcode.decoder.Version.getVersionForNumber($1);
            }
            var $2 = 0;
            var $3 = $0 - 11;
            for (var $4 = 5; $4 >= 0; $4--) {
                for (var $5 = $0 - 9; $5 >= $3; $5--) {
                    $2 = this.$5($5, $4, $2);
                }
            }
            this.$1 = com.google.zxing.qrcode.decoder.Version.$6($2);
            if (this.$1 != null && this.$1.get_dimensionForVersion() === $0) {
                return this.$1;
            }
            $2 = 0;
            for (var $6 = 5; $6 >= 0; $6--) {
                for (var $7 = $0 - 9; $7 >= $3; $7--) {
                    $2 = this.$5($6, $7, $2);
                }
            }
            this.$1 = com.google.zxing.qrcode.decoder.Version.$6($2);
            if (this.$1 != null && this.$1.get_dimensionForVersion() === $0) {
                return this.$1;
            }
            throw new Error('ReaderException');
        },
        $5: function($p0, $p1, $p2) {
            return (this.$0.get_Renamed($p0, $p1)) ? ($p2 << 1) | 1 : $p2 << 1;
        },
        $6: function() {
            var $0 = this.$3();
            var $1 = this.$4();
            var $2 = com.google.zxing.qrcode.decoder.ZXingQR$6.$3($0.get_$1());
            var $3 = this.$0.get_dimension();
            $2.$1(this.$0, $3);
            var $4 = $1.$7();
            var $5 = true;
            var $6 = new Array($1.get_totalCodewords());
            var $7 = 0;
            var $8 = 0;
            var $9 = 0;
            for (var $A = $3 - 1; $A > 0; $A -= 2) {
                if ($A === 6) {
                    $A--;
                }
                for (var $B = 0; $B < $3; $B++) {
                    var $C = ($5) ? $3 - 1 - $B : $B;
                    for (var $D = 0; $D < 2; $D++) {
                        if (!$4.get_Renamed($A - $D, $C)) {
                            $9++;
                            $8 <<= 1;
                            if (this.$0.get_Renamed($A - $D, $C)) {
                                $8 |= 1;
                            }
                            if ($9 === 8) {
                                $6[$7++] = $8;
                                $9 = 0;
                                $8 = 0;
                            }
                        }
                    }
                }
                $5 = ($5 ^ true) === 1;
            }
            if ($7 !== $1.get_totalCodewords()) {
                throw new Error('ReaderException');
            }
            return $6;
        }
    }
    com.google.zxing.qrcode.decoder.ZXingQR$8 = function(numDataCodewords, codewords) {
        this.$2 = numDataCodewords;
        this.$3 = codewords;
    }
    com.google.zxing.qrcode.decoder.ZXingQR$8.$4 = function($p0, $p1, $p2) {
        if ($p0.length !== $p1.get_totalCodewords()) {
            throw new Error('ArgumentException');
        }
        var $0 = $p1.getECBlocksForLevel($p2);
        var $1 = 0;
        var $2 = $0.$4();
        for (var $A = 0; $A < $2.length; $A++) {
            $1 += $2[$A].get_count();
        }
        var $3 = new Array($1);
        var $4 = 0;
        for (var $B = 0; $B < $2.length; $B++) {
            var $C = $2[$B];
            for (var $D = 0; $D < $C.get_count(); $D++) {
                var $E = $C.get_dataCodewords();
                var $F = $0.get_ecCodewordsPerBlock() + $E;
                $3[$4++] = new com.google.zxing.qrcode.decoder.ZXingQR$8($E, new Array($F));
            }
        }
        var $5 = $3[0].$3.length;
        var $6 = $3.length - 1;
        while ($6 >= 0) {
            var $10 = $3[$6].$3.length;
            if ($10 === $5) {
                break;
            }
            $6--;
        }
        $6++;
        var $7 = $5 - $0.get_ecCodewordsPerBlock();
        var $8 = 0;
        for (var $11 = 0; $11 < $7; $11++) {
            for (var $12 = 0; $12 < $4; $12++) {
                $3[$12].$3[$11] = $p0[$8++];
            }
        }
        for (var $13 = $6; $13 < $4; $13++) {
            $3[$13].$3[$7] = $p0[$8++];
        }
        var $9 = $3[0].$3.length;
        for (var $14 = $7; $14 < $9; $14++) {
            for (var $15 = 0; $15 < $4; $15++) {
                var $16 = ($15 < $6) ? $14 : $14 + 1;
                $3[$15].$3[$16] = $p0[$8++];
            }
        }
        return $3;
    }
    com.google.zxing.qrcode.decoder.ZXingQR$8.prototype = {
        get_$0: function() {
            return this.$2;
        },
        get_$1: function() {
            return this.$3;
        },
        $2: 0,
        $3: null
    }
    com.google.zxing.qrcode.decoder.ZXingQR$6 = function() {}
    com.google.zxing.qrcode.decoder.ZXingQR$6.$3 = function($p0) {
        if ($p0 < 0 || $p0 > 7) {
            throw new Error('ArgumentException');
        }
        return com.google.zxing.qrcode.decoder.ZXingQR$6.$0[$p0];
    }
    com.google.zxing.qrcode.decoder.ZXingQR$6.prototype = {
        $1: function($p0, $p1) {
            for (var $0 = 0; $0 < $p1; $0++) {
                for (var $1 = 0; $1 < $p1; $1++) {
                    if (this.$2($0, $1)) {
                        $p0.flip($1, $0);
                    }
                }
            }
        }
    }
    com.google.zxing.qrcode.decoder.ZXingQR$14 = function() {
        com.google.zxing.qrcode.decoder.ZXingQR$14.initializeBase(this);
    }
    com.google.zxing.qrcode.decoder.ZXingQR$14.prototype = {
        $2: function($p0, $p1) {
            return !(($p0 + $p1) & 1);
        }
    }
    com.google.zxing.qrcode.decoder.ZXingQR$15 = function() {
        com.google.zxing.qrcode.decoder.ZXingQR$15.initializeBase(this);
    }
    com.google.zxing.qrcode.decoder.ZXingQR$15.prototype = {
        $2: function($p0, $p1) {
            return !($p0 & 1);
        }
    }
    com.google.zxing.qrcode.decoder.ZXingQR$17 = function() {
        com.google.zxing.qrcode.decoder.ZXingQR$17.initializeBase(this);
    }
    com.google.zxing.qrcode.decoder.ZXingQR$17.prototype = {
        $2: function($p0, $p1) {
            return !($p1 % 3);
        }
    }
    com.google.zxing.qrcode.decoder.ZXingQR$1A = function() {
        com.google.zxing.qrcode.decoder.ZXingQR$1A.initializeBase(this);
    }
    com.google.zxing.qrcode.decoder.ZXingQR$1A.prototype = {
        $2: function($p0, $p1) {
            return !(($p0 + $p1) % 3);
        }
    }
    com.google.zxing.qrcode.decoder.ZXingQR$1B = function() {
        com.google.zxing.qrcode.decoder.ZXingQR$1B.initializeBase(this);
    }
    com.google.zxing.qrcode.decoder.ZXingQR$1B.prototype = {
        $2: function($p0, $p1) {
            return !((SupportClass.urShift1($p0, 1) + Math.floor($p1 / 3)) & 1);
        }
    }
    com.google.zxing.qrcode.decoder.ZXingQR$18 = function() {
        com.google.zxing.qrcode.decoder.ZXingQR$18.initializeBase(this);
    }
    com.google.zxing.qrcode.decoder.ZXingQR$18.prototype = {
        $2: function($p0, $p1) {
            var $0 = $p0 * $p1;
            return !(($0 & 1) + ($0 % 3));
        }
    }
    com.google.zxing.qrcode.decoder.ZXingQR$19 = function() {
        com.google.zxing.qrcode.decoder.ZXingQR$19.initializeBase(this);
    }
    com.google.zxing.qrcode.decoder.ZXingQR$19.prototype = {
        $2: function($p0, $p1) {
            var $0 = $p0 * $p1;
            return !((($0 & 1) + ($0 % 3)) & 1);
        }
    }
    com.google.zxing.qrcode.decoder.ZXingQR$16 = function() {
        com.google.zxing.qrcode.decoder.ZXingQR$16.initializeBase(this);
    }
    com.google.zxing.qrcode.decoder.ZXingQR$16.prototype = {
        $2: function($p0, $p1) {
            return !(((($p0 + $p1) & 1) + (($p0 * $p1) % 3)) & 1);
        }
    }
    com.google.zxing.qrcode.decoder.ZXingQR$4 = function() {}
    com.google.zxing.qrcode.decoder.ZXingQR$4.$6 = function($p0, $p1, $p2) {
        var $0 = new com.google.zxing.common.BitSource($p0);
        var $1 = new ss.StringBuilder();
        var $2 = null;
        var $3 = false;
        var $4 = new Array(1);
        var $5;
        do {
            if ($0.available() < 4) {
                $5 = com.google.zxing.qrcode.decoder.Mode.TERMINATOR;
            } else {
                try {
                    $5 = com.google.zxing.qrcode.decoder.Mode.forBits($0.readBits(4));
                } catch ($6) {
                    if ($6.message.indexOf('ArgumentException') < 0) {
                        throw $6;
                    }
                    throw new Error('ReaderException');
                }
            }
            if (!$5.equals(com.google.zxing.qrcode.decoder.Mode.TERMINATOR)) {
                if ($5.equals(com.google.zxing.qrcode.decoder.Mode.fnC1_FIRST_POSITION) || $5.equals(com.google.zxing.qrcode.decoder.Mode.fnC1_SECOND_POSITION)) {
                    $3 = true;
                } else if ($5.equals(com.google.zxing.qrcode.decoder.Mode.structureD_APPEND)) {
                    $0.readBits(16);
                } else if ($5.equals(com.google.zxing.qrcode.decoder.Mode.ECI)) {
                    var $7 = com.google.zxing.qrcode.decoder.ZXingQR$4.$C($0);
                    $2 = com.google.zxing.common.CharacterSetECI.getCharacterSetECIByValue($7);
                    if ($2 == null) {
                        throw new Error('ReaderException');
                    }
                } else {
                    var $8 = $0.readBits($5.getCharacterCountBits($p1));
                    if ($5.equals(com.google.zxing.qrcode.decoder.Mode.NUMERIC)) {
                        com.google.zxing.qrcode.decoder.ZXingQR$4.$A($0, $1, $8);
                    } else if ($5.equals(com.google.zxing.qrcode.decoder.Mode.ALPHANUMERIC)) {
                        com.google.zxing.qrcode.decoder.ZXingQR$4.$9($0, $1, $8, $3);
                    } else if ($5.equals(com.google.zxing.qrcode.decoder.Mode.BYTE)) {
                        com.google.zxing.qrcode.decoder.ZXingQR$4.$8($0, $1, $8, $2, $4);
                    } else if ($5.equals(com.google.zxing.qrcode.decoder.Mode.KANJI)) {
                        com.google.zxing.qrcode.decoder.ZXingQR$4.$7($0, $1, $8);
                    } else {
                        throw new Error('ReaderException');
                    }
                }
            }
        } while (!$5.equals(com.google.zxing.qrcode.decoder.Mode.TERMINATOR));
        return new com.google.zxing.common.DecoderResult($p0, $1.toString(), (!$4.length) ? null : $4, $p2);
    }
    com.google.zxing.qrcode.decoder.ZXingQR$4.$7 = function($p0, $p1, $p2) {
        var $0 = new Array(2 * $p2);
        var $1 = 0;
        while ($p2 > 0) {
            var $2 = $p0.readBits(13);
            var $3 = (Math.floor($2 / 192) << 8) | ($2 % 192);
            if ($3 < 7936) {
                $3 += 33088;
            } else {
                $3 += 49472;
            }
            $0[$1] = ($3 >> 8);
            $0[$1 + 1] = $3;
            $1 += 2;
            $p2--;
        }
        try {
            $p1.append(SystemExtend.Text.Encoding.getEncoding('SJIS').getString(SupportClass.toByteArray1($0)));
        } catch ($4) {
            throw new Error('ReaderException');
        }
    }
    com.google.zxing.qrcode.decoder.ZXingQR$4.$8 = function($p0, $p1, $p2, $p3, $p4) {
        var $0 = new Array($p2);
        if ($p2 << 3 > $p0.available()) {
            throw new Error('ReaderException');
        }
        for (var $2 = 0; $2 < $p2; $2++) {
            $0[$2] = $p0.readBits(8);
        }
        var $1;
        if ($p3 == null) {
            $1 = com.google.zxing.qrcode.decoder.ZXingQR$4.$B($0);
        } else {
            $1 = $p3.get_encodingName();
        }
        try {
            $p1.append(SystemExtend.Text.Encoding.getEncoding($1).getString(SupportClass.toByteArray1($0)));
        } catch ($3) {
            throw new Error('ReaderException');
        }
        $p4.add(SupportClass.toByteArray1($0));
    }
    com.google.zxing.qrcode.decoder.ZXingQR$4.$9 = function($p0, $p1, $p2, $p3) {
        var $0 = $p1.toString().length;
        while ($p2 > 1) {
            var $3 = $p0.readBits(11);
            $p1.append(com.google.zxing.qrcode.decoder.ZXingQR$4.$0[Math.floor($3 / 45)]);
            $p1.append(com.google.zxing.qrcode.decoder.ZXingQR$4.$0[$3 % 45]);
            $p2 -= 2;
        }
        if ($p2 === 1) {
            $p1.append(com.google.zxing.qrcode.decoder.ZXingQR$4.$0[$p0.readBits(6)]);
        }
        var $1 = new Array($p1.toString().length);
        SupportClass.getCharsFromString($p1.toString(), 0, $p1.toString().length, $1, 0);
        var $2 = [$1];
        if ($p3) {
            for (var $4 = $0; $4 < $2.length; $4++) {
                if ($2[$4] === '%') {
                    if ($4 < $2.length - 1 && $2[$4 + 1] === '%') {
                        $2 = $2.removeRange($4 + 1, 1);
                    } else {
                        $2[$4] = SystemExtend.Int32Extend.toChar(29);
                    }
                }
            }
            $p1.clear();
            $p1.append($2.join());
        }
    }
    com.google.zxing.qrcode.decoder.ZXingQR$4.$A = function($p0, $p1, $p2) {
        while ($p2 >= 3) {
            var $0 = $p0.readBits(10);
            if ($0 >= 1000) {
                throw new Error('ReaderException');
            }
            $p1.append(com.google.zxing.qrcode.decoder.ZXingQR$4.$0[Math.floor($0 / 100)]);
            $p1.append(com.google.zxing.qrcode.decoder.ZXingQR$4.$0[Math.floor($0 / 10) % 10]);
            $p1.append(com.google.zxing.qrcode.decoder.ZXingQR$4.$0[$0 % 10]);
            $p2 -= 3;
        }
        if ($p2 === 2) {
            var $1 = $p0.readBits(7);
            if ($1 >= 100) {
                throw new Error('ReaderException');
            }
            $p1.append(com.google.zxing.qrcode.decoder.ZXingQR$4.$0[Math.floor($1 / 10)]);
            $p1.append(com.google.zxing.qrcode.decoder.ZXingQR$4.$0[$1 % 10]);
        } else if ($p2 === 1) {
            var $2 = $p0.readBits(4);
            if ($2 >= 10) {
                throw new Error('ReaderException');
            }
            $p1.append(com.google.zxing.qrcode.decoder.ZXingQR$4.$0[$2]);
        }
    }
    com.google.zxing.qrcode.decoder.ZXingQR$4.$B = function($p0) {
        if (com.google.zxing.qrcode.decoder.ZXingQR$4.$3) {
            return 'SJIS';
        }
        if ($p0.length > 3 && $p0[0] === SupportClass.identity1(239) && $p0[1] === SupportClass.identity1(187) && $p0[2] === SupportClass.identity1(191)) {
            return 'UTF-8';
        }
        var $0 = $p0.length;
        var $1 = true;
        var $2 = true;
        var $3 = 0;
        var $4 = 0;
        var $5 = false;
        var $6 = false;
        for (var $7 = 0; $7 < $0 && ($1 || $2); $7++) {
            var $8 = $p0[$7] & 255;
            if (($8 === 194 || $8 === 195) && $7 < $0 - 1) {
                var $9 = $p0[$7 + 1] & 255;
                if ($9 <= 191 && (($8 === 194 && $9 >= 160) || ($8 === 195 && $9 >= 128))) {
                    $5 = true;
                }
            }
            if ($8 >= 127 && $8 <= 159) {
                $1 = false;
            }
            if ($8 >= 161 && $8 <= 223) {
                if (!$6) {
                    $4++;
                }
            }
            if (!$6 && (($8 >= 240 && $8 <= 255) || $8 === 128 || $8 === 160)) {
                $2 = false;
            }
            if ((($8 >= 129 && $8 <= 159) || ($8 >= 224 && $8 <= 239))) {
                if ($6) {
                    $6 = false;
                } else {
                    $6 = true;
                    if ($7 >= $p0.length - 1) {
                        $2 = false;
                    } else {
                        var $A = $p0[$7 + 1] & 255;
                        if ($A < 64 || $A > 252) {
                            $2 = false;
                        } else {
                            $3++;
                        }
                    }
                }
            } else {
                $6 = false;
            }
        }
        if ($2 && ($3 >= 3 || 20 * $4 > $0)) {
            return 'SJIS';
        }
        if (!$5 && $1) {
            return 'ISO-8859-1';
        }
        return 'UTF-8';
    }
    com.google.zxing.qrcode.decoder.ZXingQR$4.$C = function($p0) {
        var $0 = $p0.readBits(8);
        if (!($0 & 128)) {
            return $0 & 127;
        } else if (($0 & 192) === 128) {
            var $1 = $p0.readBits(8);
            return (($0 & 63) << 8) | $1;
        } else if (($0 & 224) === 192) {
            var $2 = $p0.readBits(16);
            return (($0 & 31) << 16) | $2;
        }
        throw new Error('ArgumentException: Bad ECI bits starting with byte ' + $0);
    }
    com.google.zxing.qrcode.decoder.Decoder = function() {
        this.$0 = new com.google.zxing.common.reedsolomon.ReedSolomonDecoder(com.google.zxing.common.reedsolomon.GF256.qR_CODE_FIELD);
    }
    com.google.zxing.qrcode.decoder.Decoder.prototype = {
        $0: null,
        decode1: function(image) {
            var $0 = image.length;
            var $1 = com.google.zxing.common.BitMatrix.createSquareInstance($0);
            for (var $2 = 0; $2 < $0; $2++) {
                for (var $3 = 0; $3 < $0; $3++) {
                    if (image[$2][$3]) {
                        $1.set_Renamed($3, $2);
                    }
                }
            }
            return this.decode2($1);
        },
        decode2: function(bits) {
            var $0 = new com.google.zxing.qrcode.decoder.ZXingQR$7(bits);
            var $1 = $0.$4();
            var $2 = $0.$3().get_$0();
            var $3 = $0.$6();
            var $4 = com.google.zxing.qrcode.decoder.ZXingQR$8.$4($3, $1, $2);
            var $5 = 0;
            for (var $8 = 0; $8 < $4.length; $8++) {
                $5 += $4[$8].get_$0();
            }
            var $6 = new Array($5);
            var $7 = 0;
            for (var $9 = 0; $9 < $4.length; $9++) {
                var $A = $4[$9];
                var $B = $A.get_$1();
                var $C = $A.get_$0();
                this.$1($B, $C);
                for (var $D = 0; $D < $C; $D++) {
                    $6[$7++] = $B[$D];
                }
            }
            return com.google.zxing.qrcode.decoder.ZXingQR$4.$6($6, $1, $2);
        },
        $1: function($p0, $p1) {
            var $0 = $p0.length;
            var $1 = new Array($0);
            for (var $3 = 0; $3 < $0; $3++) {
                $1[$3] = $p0[$3] & 255;
            }
            var $2 = $p0.length - $p1;
            try {
                this.$0.decode($1, $2);
            } catch ($4) {
                if ($4.message.indexOf('ReedSolomonException') < 0) {
                    throw $4;
                }
                throw new Error('ReaderException');
            }
            for (var $5 = 0; $5 < $p1; $5++) {
                $p0[$5] = $1[$5];
            }
        }
    }
    com.google.zxing.qrcode.decoder.ErrorCorrectionLevel = function(ordinal, bits, name) {
        this.$1 = ordinal;
        this.$2 = bits;
        this.$3 = name;
    }
    com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.forBits = function(bits) {
        if (bits < 0 || bits >= com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.$0.length) {
            throw new Error('ArgumentException');
        }
        return com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.$0[bits];
    }
    com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.prototype = {
        get_bits: function() {
            return this.$2;
        },
        get_name: function() {
            return this.$3;
        },
        $1: 0,
        $2: 0,
        $3: null,
        ordinal: function() {
            return this.$1;
        },
        toString: function() {
            return this.$3;
        }
    }
    com.google.zxing.qrcode.decoder.ZXingQR$3 = function(formatInfo) {
        this.$5 = com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.forBits((formatInfo >> 3) & 3);
        this.$6 = (formatInfo & 7);
    }
    com.google.zxing.qrcode.decoder.ZXingQR$3.$7 = function($p0, $p1) {
        $p0 ^= $p1;
        return com.google.zxing.qrcode.decoder.ZXingQR$3.$4[$p0 & 15] + com.google.zxing.qrcode.decoder.ZXingQR$3.$4[(SupportClass.urShift1($p0, 4) & 15)] + com.google.zxing.qrcode.decoder.ZXingQR$3.$4[(SupportClass.urShift1($p0, 8) & 15)] + com.google.zxing.qrcode.decoder.ZXingQR$3.$4[(SupportClass.urShift1($p0, 12) & 15)] + com.google.zxing.qrcode.decoder.ZXingQR$3.$4[(SupportClass.urShift1($p0, 16) & 15)] + com.google.zxing.qrcode.decoder.ZXingQR$3.$4[(SupportClass.urShift1($p0, 20) & 15)] + com.google.zxing.qrcode.decoder.ZXingQR$3.$4[(SupportClass.urShift1($p0, 24) & 15)] + com.google.zxing.qrcode.decoder.ZXingQR$3.$4[(SupportClass.urShift1($p0, 28) & 15)];
    }
    com.google.zxing.qrcode.decoder.ZXingQR$3.$8 = function($p0) {
        var $0 = com.google.zxing.qrcode.decoder.ZXingQR$3.$9($p0);
        if ($0 != null) {
            return $0;
        }
        return com.google.zxing.qrcode.decoder.ZXingQR$3.$9($p0 ^ 21522);
    }
    com.google.zxing.qrcode.decoder.ZXingQR$3.$9 = function($p0) {
        var $0 = SystemExtend.Int32Extend.maxValue;
        var $1 = 0;
        for (var $2 = 0; $2 < com.google.zxing.qrcode.decoder.ZXingQR$3.$3.length; $2++) {
            var $3 = com.google.zxing.qrcode.decoder.ZXingQR$3.$3[$2];
            var $4 = $3[0];
            if ($4 === $p0) {
                return new com.google.zxing.qrcode.decoder.ZXingQR$3($3[1]);
            }
            var $5 = com.google.zxing.qrcode.decoder.ZXingQR$3.$7($p0, $4);
            if ($5 < $0) {
                $1 = $3[1];
                $0 = $5;
            }
        }
        if ($0 <= 3) {
            return new com.google.zxing.qrcode.decoder.ZXingQR$3($1);
        }
        return null;
    }
    com.google.zxing.qrcode.decoder.ZXingQR$3.prototype = {
        get_$0: function() {
            return this.$5;
        },
        get_$1: function() {
            return this.$6;
        },
        $5: null,
        $6: 0,
        $A: function() {
            return (this.$5.ordinal() << 3) | this.$6;
        },
        $B: function($p0) {
            if (!(Type.canCast($p0, com.google.zxing.qrcode.decoder.ZXingQR$3))) {
                return false;
            }
            var $0 = $p0;
            return this.$5 === $0.$5 && this.$6 === $0.$6;
        }
    }
    com.google.zxing.qrcode.decoder.Mode = function(characterCountBitsForVersions, bits, name) {
        this.$0 = characterCountBitsForVersions;
        this.$1 = bits;
        this.$2 = name;
    }
    com.google.zxing.qrcode.decoder.Mode.forBits = function(bits) {
        switch (bits) {
            case 0:
                return com.google.zxing.qrcode.decoder.Mode.TERMINATOR;
            case 1:
                return com.google.zxing.qrcode.decoder.Mode.NUMERIC;
            case 2:
                return com.google.zxing.qrcode.decoder.Mode.ALPHANUMERIC;
            case 3:
                return com.google.zxing.qrcode.decoder.Mode.structureD_APPEND;
            case 4:
                return com.google.zxing.qrcode.decoder.Mode.BYTE;
            case 5:
                return com.google.zxing.qrcode.decoder.Mode.fnC1_FIRST_POSITION;
            case 7:
                return com.google.zxing.qrcode.decoder.Mode.ECI;
            case 8:
                return com.google.zxing.qrcode.decoder.Mode.KANJI;
            case 9:
                return com.google.zxing.qrcode.decoder.Mode.fnC1_SECOND_POSITION;
            default:
                throw new Error('ArgumentException');
        }
    }
    com.google.zxing.qrcode.decoder.Mode.prototype = {
        get_bits: function() {
            return this.$1;
        },
        get_name: function() {
            return this.$2;
        },
        $0: null,
        $1: 0,
        $2: null,
        getCharacterCountBits: function(version) {
            if (this.$0 == null) {
                throw new Error("ArgumentException: Character count doesn't apply to this mode");
            }
            var $0 = version.get_versionNumber();
            var $1;
            if ($0 <= 9) {
                $1 = 0;
            } else if ($0 <= 26) {
                $1 = 1;
            } else {
                $1 = 2;
            }
            return this.$0[$1];
        },
        toString: function() {
            return this.$2;
        },
        equals: function(obj) {
            return this === obj;
        }
    }
    com.google.zxing.qrcode.decoder.Version = function(versionNumber, alignmentPatternCenters, ecBlocks1, ecBlocks2, ecBlocks3, ecBlocks4) {
        this.$2 = versionNumber;
        this.$3 = alignmentPatternCenters;
        this.$4 = [ecBlocks1, ecBlocks2, ecBlocks3, ecBlocks4];
        var $0 = 0;
        var $1 = ecBlocks1.get_ecCodewordsPerBlock();
        var $2 = ecBlocks1.$4();
        for (var $3 = 0; $3 < $2.length; $3++) {
            var $4 = $2[$3];
            $0 += $4.get_count() * ($4.get_dataCodewords() + $1);
        }
        this.$5 = $0;
    }
    com.google.zxing.qrcode.decoder.Version.getProvisionalVersionForDimension = function(dimension) {
        if (dimension % 4 !== 1) {
            throw new Error('ReaderException');
        }
        try {
            return com.google.zxing.qrcode.decoder.Version.getVersionForNumber((dimension - 17) >> 2);
        } catch ($0) {
            if ($0.message.indexOf('ArgumentException') < 0) {
                throw $0;
            }
            throw new Error('ReaderException');
        }
    }
    com.google.zxing.qrcode.decoder.Version.getVersionForNumber = function(versionNumber) {
        if (versionNumber < 1 || versionNumber > 40) {
            throw new Error('ArgumentException');
        }
        return com.google.zxing.qrcode.decoder.Version.$1[versionNumber - 1];
    }
    com.google.zxing.qrcode.decoder.Version.$6 = function($p0) {
        var $0 = SystemExtend.Int32Extend.maxValue;
        var $1 = 0;
        for (var $2 = 0; $2 < com.google.zxing.qrcode.decoder.Version.$0.length; $2++) {
            var $3 = com.google.zxing.qrcode.decoder.Version.$0[$2];
            if ($3 === $p0) {
                return com.google.zxing.qrcode.decoder.Version.getVersionForNumber($2 + 7);
            }
            var $4 = com.google.zxing.qrcode.decoder.ZXingQR$3.$7($p0, $3);
            if ($4 < $0) {
                $1 = $2 + 7;
                $0 = $4;
            }
        }
        if ($0 <= 3) {
            return com.google.zxing.qrcode.decoder.Version.getVersionForNumber($1);
        }
        return null;
    }
    com.google.zxing.qrcode.decoder.Version.$8 = function() {
        return [new com.google.zxing.qrcode.decoder.Version(1, [], com.google.zxing.qrcode.decoder.ECBlocks.$2(7, new com.google.zxing.qrcode.decoder.ECB(1, 19)), com.google.zxing.qrcode.decoder.ECBlocks.$2(10, new com.google.zxing.qrcode.decoder.ECB(1, 16)), com.google.zxing.qrcode.decoder.ECBlocks.$2(13, new com.google.zxing.qrcode.decoder.ECB(1, 13)), com.google.zxing.qrcode.decoder.ECBlocks.$2(17, new com.google.zxing.qrcode.decoder.ECB(1, 9))), new com.google.zxing.qrcode.decoder.Version(2, [6, 18], com.google.zxing.qrcode.decoder.ECBlocks.$2(10, new com.google.zxing.qrcode.decoder.ECB(1, 34)), com.google.zxing.qrcode.decoder.ECBlocks.$2(16, new com.google.zxing.qrcode.decoder.ECB(1, 28)), com.google.zxing.qrcode.decoder.ECBlocks.$2(22, new com.google.zxing.qrcode.decoder.ECB(1, 22)), com.google.zxing.qrcode.decoder.ECBlocks.$2(28, new com.google.zxing.qrcode.decoder.ECB(1, 16))), new com.google.zxing.qrcode.decoder.Version(3, [6, 22], com.google.zxing.qrcode.decoder.ECBlocks.$2(15, new com.google.zxing.qrcode.decoder.ECB(1, 55)), com.google.zxing.qrcode.decoder.ECBlocks.$2(26, new com.google.zxing.qrcode.decoder.ECB(1, 44)), com.google.zxing.qrcode.decoder.ECBlocks.$2(18, new com.google.zxing.qrcode.decoder.ECB(2, 17)), com.google.zxing.qrcode.decoder.ECBlocks.$2(22, new com.google.zxing.qrcode.decoder.ECB(2, 13))), new com.google.zxing.qrcode.decoder.Version(4, [6, 26], com.google.zxing.qrcode.decoder.ECBlocks.$2(20, new com.google.zxing.qrcode.decoder.ECB(1, 80)), com.google.zxing.qrcode.decoder.ECBlocks.$2(18, new com.google.zxing.qrcode.decoder.ECB(2, 32)), com.google.zxing.qrcode.decoder.ECBlocks.$2(26, new com.google.zxing.qrcode.decoder.ECB(2, 24)), com.google.zxing.qrcode.decoder.ECBlocks.$2(16, new com.google.zxing.qrcode.decoder.ECB(4, 9))), new com.google.zxing.qrcode.decoder.Version(5, [6, 30], com.google.zxing.qrcode.decoder.ECBlocks.$2(26, new com.google.zxing.qrcode.decoder.ECB(1, 108)), com.google.zxing.qrcode.decoder.ECBlocks.$2(24, new com.google.zxing.qrcode.decoder.ECB(2, 43)), com.google.zxing.qrcode.decoder.ECBlocks.$3(18, new com.google.zxing.qrcode.decoder.ECB(2, 15), new com.google.zxing.qrcode.decoder.ECB(2, 16)), com.google.zxing.qrcode.decoder.ECBlocks.$3(22, new com.google.zxing.qrcode.decoder.ECB(2, 11), new com.google.zxing.qrcode.decoder.ECB(2, 12))), new com.google.zxing.qrcode.decoder.Version(6, [6, 34], com.google.zxing.qrcode.decoder.ECBlocks.$2(18, new com.google.zxing.qrcode.decoder.ECB(2, 68)), com.google.zxing.qrcode.decoder.ECBlocks.$2(16, new com.google.zxing.qrcode.decoder.ECB(4, 27)), com.google.zxing.qrcode.decoder.ECBlocks.$2(24, new com.google.zxing.qrcode.decoder.ECB(4, 19)), com.google.zxing.qrcode.decoder.ECBlocks.$2(28, new com.google.zxing.qrcode.decoder.ECB(4, 15))), new com.google.zxing.qrcode.decoder.Version(7, [6, 22, 38], com.google.zxing.qrcode.decoder.ECBlocks.$2(20, new com.google.zxing.qrcode.decoder.ECB(2, 78)), com.google.zxing.qrcode.decoder.ECBlocks.$2(18, new com.google.zxing.qrcode.decoder.ECB(4, 31)), com.google.zxing.qrcode.decoder.ECBlocks.$3(18, new com.google.zxing.qrcode.decoder.ECB(2, 14), new com.google.zxing.qrcode.decoder.ECB(4, 15)), com.google.zxing.qrcode.decoder.ECBlocks.$3(26, new com.google.zxing.qrcode.decoder.ECB(4, 13), new com.google.zxing.qrcode.decoder.ECB(1, 14))), new com.google.zxing.qrcode.decoder.Version(8, [6, 24, 42], com.google.zxing.qrcode.decoder.ECBlocks.$2(24, new com.google.zxing.qrcode.decoder.ECB(2, 97)), com.google.zxing.qrcode.decoder.ECBlocks.$3(22, new com.google.zxing.qrcode.decoder.ECB(2, 38), new com.google.zxing.qrcode.decoder.ECB(2, 39)), com.google.zxing.qrcode.decoder.ECBlocks.$3(22, new com.google.zxing.qrcode.decoder.ECB(4, 18), new com.google.zxing.qrcode.decoder.ECB(2, 19)), com.google.zxing.qrcode.decoder.ECBlocks.$3(26, new com.google.zxing.qrcode.decoder.ECB(4, 14), new com.google.zxing.qrcode.decoder.ECB(2, 15))), new com.google.zxing.qrcode.decoder.Version(9, [6, 26, 46], com.google.zxing.qrcode.decoder.ECBlocks.$2(30, new com.google.zxing.qrcode.decoder.ECB(2, 116)), com.google.zxing.qrcode.decoder.ECBlocks.$3(22, new com.google.zxing.qrcode.decoder.ECB(3, 36), new com.google.zxing.qrcode.decoder.ECB(2, 37)), com.google.zxing.qrcode.decoder.ECBlocks.$3(20, new com.google.zxing.qrcode.decoder.ECB(4, 16), new com.google.zxing.qrcode.decoder.ECB(4, 17)), com.google.zxing.qrcode.decoder.ECBlocks.$3(24, new com.google.zxing.qrcode.decoder.ECB(4, 12), new com.google.zxing.qrcode.decoder.ECB(4, 13))), new com.google.zxing.qrcode.decoder.Version(10, [6, 28, 50], com.google.zxing.qrcode.decoder.ECBlocks.$3(18, new com.google.zxing.qrcode.decoder.ECB(2, 68), new com.google.zxing.qrcode.decoder.ECB(2, 69)), com.google.zxing.qrcode.decoder.ECBlocks.$3(26, new com.google.zxing.qrcode.decoder.ECB(4, 43), new com.google.zxing.qrcode.decoder.ECB(1, 44)), com.google.zxing.qrcode.decoder.ECBlocks.$3(24, new com.google.zxing.qrcode.decoder.ECB(6, 19), new com.google.zxing.qrcode.decoder.ECB(2, 20)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(6, 15), new com.google.zxing.qrcode.decoder.ECB(2, 16))), new com.google.zxing.qrcode.decoder.Version(11, [6, 30, 54], com.google.zxing.qrcode.decoder.ECBlocks.$2(20, new com.google.zxing.qrcode.decoder.ECB(4, 81)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(1, 50), new com.google.zxing.qrcode.decoder.ECB(4, 51)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(4, 22), new com.google.zxing.qrcode.decoder.ECB(4, 23)), com.google.zxing.qrcode.decoder.ECBlocks.$3(24, new com.google.zxing.qrcode.decoder.ECB(3, 12), new com.google.zxing.qrcode.decoder.ECB(8, 13))), new com.google.zxing.qrcode.decoder.Version(12, [6, 32, 58], com.google.zxing.qrcode.decoder.ECBlocks.$3(24, new com.google.zxing.qrcode.decoder.ECB(2, 92), new com.google.zxing.qrcode.decoder.ECB(2, 93)), com.google.zxing.qrcode.decoder.ECBlocks.$3(22, new com.google.zxing.qrcode.decoder.ECB(6, 36), new com.google.zxing.qrcode.decoder.ECB(2, 37)), com.google.zxing.qrcode.decoder.ECBlocks.$3(26, new com.google.zxing.qrcode.decoder.ECB(4, 20), new com.google.zxing.qrcode.decoder.ECB(6, 21)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(7, 14), new com.google.zxing.qrcode.decoder.ECB(4, 15))), new com.google.zxing.qrcode.decoder.Version(13, [6, 34, 62], com.google.zxing.qrcode.decoder.ECBlocks.$2(26, new com.google.zxing.qrcode.decoder.ECB(4, 107)), com.google.zxing.qrcode.decoder.ECBlocks.$3(22, new com.google.zxing.qrcode.decoder.ECB(8, 37), new com.google.zxing.qrcode.decoder.ECB(1, 38)), com.google.zxing.qrcode.decoder.ECBlocks.$3(24, new com.google.zxing.qrcode.decoder.ECB(8, 20), new com.google.zxing.qrcode.decoder.ECB(4, 21)), com.google.zxing.qrcode.decoder.ECBlocks.$3(22, new com.google.zxing.qrcode.decoder.ECB(12, 11), new com.google.zxing.qrcode.decoder.ECB(4, 12))), new com.google.zxing.qrcode.decoder.Version(14, [6, 26, 46, 66], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(3, 115), new com.google.zxing.qrcode.decoder.ECB(1, 116)), com.google.zxing.qrcode.decoder.ECBlocks.$3(24, new com.google.zxing.qrcode.decoder.ECB(4, 40), new com.google.zxing.qrcode.decoder.ECB(5, 41)), com.google.zxing.qrcode.decoder.ECBlocks.$3(20, new com.google.zxing.qrcode.decoder.ECB(11, 16), new com.google.zxing.qrcode.decoder.ECB(5, 17)), com.google.zxing.qrcode.decoder.ECBlocks.$3(24, new com.google.zxing.qrcode.decoder.ECB(11, 12), new com.google.zxing.qrcode.decoder.ECB(5, 13))), new com.google.zxing.qrcode.decoder.Version(15, [6, 26, 48, 70], com.google.zxing.qrcode.decoder.ECBlocks.$3(22, new com.google.zxing.qrcode.decoder.ECB(5, 87), new com.google.zxing.qrcode.decoder.ECB(1, 88)), com.google.zxing.qrcode.decoder.ECBlocks.$3(24, new com.google.zxing.qrcode.decoder.ECB(5, 41), new com.google.zxing.qrcode.decoder.ECB(5, 42)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(5, 24), new com.google.zxing.qrcode.decoder.ECB(7, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(24, new com.google.zxing.qrcode.decoder.ECB(11, 12), new com.google.zxing.qrcode.decoder.ECB(7, 13))), new com.google.zxing.qrcode.decoder.Version(16, [6, 26, 50, 74], com.google.zxing.qrcode.decoder.ECBlocks.$3(24, new com.google.zxing.qrcode.decoder.ECB(5, 98), new com.google.zxing.qrcode.decoder.ECB(1, 99)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(7, 45), new com.google.zxing.qrcode.decoder.ECB(3, 46)), com.google.zxing.qrcode.decoder.ECBlocks.$3(24, new com.google.zxing.qrcode.decoder.ECB(15, 19), new com.google.zxing.qrcode.decoder.ECB(2, 20)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(3, 15), new com.google.zxing.qrcode.decoder.ECB(13, 16))), new com.google.zxing.qrcode.decoder.Version(17, [6, 30, 54, 78], com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(1, 107), new com.google.zxing.qrcode.decoder.ECB(5, 108)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(10, 46), new com.google.zxing.qrcode.decoder.ECB(1, 47)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(1, 22), new com.google.zxing.qrcode.decoder.ECB(15, 23)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(2, 14), new com.google.zxing.qrcode.decoder.ECB(17, 15))), new com.google.zxing.qrcode.decoder.Version(18, [6, 30, 56, 82], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(5, 120), new com.google.zxing.qrcode.decoder.ECB(1, 121)), com.google.zxing.qrcode.decoder.ECBlocks.$3(26, new com.google.zxing.qrcode.decoder.ECB(9, 43), new com.google.zxing.qrcode.decoder.ECB(4, 44)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(17, 22), new com.google.zxing.qrcode.decoder.ECB(1, 23)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(2, 14), new com.google.zxing.qrcode.decoder.ECB(19, 15))), new com.google.zxing.qrcode.decoder.Version(19, [6, 30, 58, 86], com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(3, 113), new com.google.zxing.qrcode.decoder.ECB(4, 114)), com.google.zxing.qrcode.decoder.ECBlocks.$3(26, new com.google.zxing.qrcode.decoder.ECB(3, 44), new com.google.zxing.qrcode.decoder.ECB(11, 45)), com.google.zxing.qrcode.decoder.ECBlocks.$3(26, new com.google.zxing.qrcode.decoder.ECB(17, 21), new com.google.zxing.qrcode.decoder.ECB(4, 22)), com.google.zxing.qrcode.decoder.ECBlocks.$3(26, new com.google.zxing.qrcode.decoder.ECB(9, 13), new com.google.zxing.qrcode.decoder.ECB(16, 14))), new com.google.zxing.qrcode.decoder.Version(20, [6, 34, 62, 90], com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(3, 107), new com.google.zxing.qrcode.decoder.ECB(5, 108)), com.google.zxing.qrcode.decoder.ECBlocks.$3(26, new com.google.zxing.qrcode.decoder.ECB(3, 41), new com.google.zxing.qrcode.decoder.ECB(13, 42)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(15, 24), new com.google.zxing.qrcode.decoder.ECB(5, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(15, 15), new com.google.zxing.qrcode.decoder.ECB(10, 16))), new com.google.zxing.qrcode.decoder.Version(21, [6, 28, 50, 72, 94], com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(4, 116), new com.google.zxing.qrcode.decoder.ECB(4, 117)), com.google.zxing.qrcode.decoder.ECBlocks.$2(26, new com.google.zxing.qrcode.decoder.ECB(17, 42)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(17, 22), new com.google.zxing.qrcode.decoder.ECB(6, 23)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(19, 16), new com.google.zxing.qrcode.decoder.ECB(6, 17))), new com.google.zxing.qrcode.decoder.Version(22, [6, 26, 50, 74, 98], com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(2, 111), new com.google.zxing.qrcode.decoder.ECB(7, 112)), com.google.zxing.qrcode.decoder.ECBlocks.$2(28, new com.google.zxing.qrcode.decoder.ECB(17, 46)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(7, 24), new com.google.zxing.qrcode.decoder.ECB(16, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$2(24, new com.google.zxing.qrcode.decoder.ECB(34, 13))), new com.google.zxing.qrcode.decoder.Version(23, [6, 30, 54, 74, 102], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(4, 121), new com.google.zxing.qrcode.decoder.ECB(5, 122)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(4, 47), new com.google.zxing.qrcode.decoder.ECB(14, 48)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(11, 24), new com.google.zxing.qrcode.decoder.ECB(14, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(16, 15), new com.google.zxing.qrcode.decoder.ECB(14, 16))), new com.google.zxing.qrcode.decoder.Version(24, [6, 28, 54, 80, 106], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(6, 117), new com.google.zxing.qrcode.decoder.ECB(4, 118)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(6, 45), new com.google.zxing.qrcode.decoder.ECB(14, 46)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(11, 24), new com.google.zxing.qrcode.decoder.ECB(16, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(30, 16), new com.google.zxing.qrcode.decoder.ECB(2, 17))), new com.google.zxing.qrcode.decoder.Version(25, [6, 32, 58, 84, 110], com.google.zxing.qrcode.decoder.ECBlocks.$3(26, new com.google.zxing.qrcode.decoder.ECB(8, 106), new com.google.zxing.qrcode.decoder.ECB(4, 107)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(8, 47), new com.google.zxing.qrcode.decoder.ECB(13, 48)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(7, 24), new com.google.zxing.qrcode.decoder.ECB(22, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(22, 15), new com.google.zxing.qrcode.decoder.ECB(13, 16))), new com.google.zxing.qrcode.decoder.Version(26, [6, 30, 58, 86, 114], com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(10, 114), new com.google.zxing.qrcode.decoder.ECB(2, 115)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(19, 46), new com.google.zxing.qrcode.decoder.ECB(4, 47)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(28, 22), new com.google.zxing.qrcode.decoder.ECB(6, 23)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(33, 16), new com.google.zxing.qrcode.decoder.ECB(4, 17))), new com.google.zxing.qrcode.decoder.Version(27, [6, 34, 62, 90, 118], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(8, 122), new com.google.zxing.qrcode.decoder.ECB(4, 123)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(22, 45), new com.google.zxing.qrcode.decoder.ECB(3, 46)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(8, 23), new com.google.zxing.qrcode.decoder.ECB(26, 24)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(12, 15), new com.google.zxing.qrcode.decoder.ECB(28, 16))), new com.google.zxing.qrcode.decoder.Version(28, [6, 26, 50, 74, 98, 122], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(3, 117), new com.google.zxing.qrcode.decoder.ECB(10, 118)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(3, 45), new com.google.zxing.qrcode.decoder.ECB(23, 46)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(4, 24), new com.google.zxing.qrcode.decoder.ECB(31, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(11, 15), new com.google.zxing.qrcode.decoder.ECB(31, 16))), new com.google.zxing.qrcode.decoder.Version(29, [6, 30, 54, 78, 102, 126], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(7, 116), new com.google.zxing.qrcode.decoder.ECB(7, 117)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(21, 45), new com.google.zxing.qrcode.decoder.ECB(7, 46)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(1, 23), new com.google.zxing.qrcode.decoder.ECB(37, 24)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(19, 15), new com.google.zxing.qrcode.decoder.ECB(26, 16))), new com.google.zxing.qrcode.decoder.Version(30, [6, 26, 52, 78, 104, 130], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(5, 115), new com.google.zxing.qrcode.decoder.ECB(10, 116)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(19, 47), new com.google.zxing.qrcode.decoder.ECB(10, 48)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(15, 24), new com.google.zxing.qrcode.decoder.ECB(25, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(23, 15), new com.google.zxing.qrcode.decoder.ECB(25, 16))), new com.google.zxing.qrcode.decoder.Version(31, [6, 30, 56, 82, 108, 134], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(13, 115), new com.google.zxing.qrcode.decoder.ECB(3, 116)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(2, 46), new com.google.zxing.qrcode.decoder.ECB(29, 47)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(42, 24), new com.google.zxing.qrcode.decoder.ECB(1, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(23, 15), new com.google.zxing.qrcode.decoder.ECB(28, 16))), new com.google.zxing.qrcode.decoder.Version(32, [6, 34, 60, 86, 112, 138], com.google.zxing.qrcode.decoder.ECBlocks.$2(30, new com.google.zxing.qrcode.decoder.ECB(17, 115)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(10, 46), new com.google.zxing.qrcode.decoder.ECB(23, 47)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(10, 24), new com.google.zxing.qrcode.decoder.ECB(35, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(19, 15), new com.google.zxing.qrcode.decoder.ECB(35, 16))), new com.google.zxing.qrcode.decoder.Version(33, [6, 30, 58, 86, 114, 142], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(17, 115), new com.google.zxing.qrcode.decoder.ECB(1, 116)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(14, 46), new com.google.zxing.qrcode.decoder.ECB(21, 47)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(29, 24), new com.google.zxing.qrcode.decoder.ECB(19, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(11, 15), new com.google.zxing.qrcode.decoder.ECB(46, 16))), new com.google.zxing.qrcode.decoder.Version(34, [6, 34, 62, 90, 118, 146], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(13, 115), new com.google.zxing.qrcode.decoder.ECB(6, 116)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(14, 46), new com.google.zxing.qrcode.decoder.ECB(23, 47)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(44, 24), new com.google.zxing.qrcode.decoder.ECB(7, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(59, 16), new com.google.zxing.qrcode.decoder.ECB(1, 17))), new com.google.zxing.qrcode.decoder.Version(35, [6, 30, 54, 78, 102, 126, 150], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(12, 121), new com.google.zxing.qrcode.decoder.ECB(7, 122)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(12, 47), new com.google.zxing.qrcode.decoder.ECB(26, 48)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(39, 24), new com.google.zxing.qrcode.decoder.ECB(14, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(22, 15), new com.google.zxing.qrcode.decoder.ECB(41, 16))), new com.google.zxing.qrcode.decoder.Version(36, [6, 24, 50, 76, 102, 128, 154], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(6, 121), new com.google.zxing.qrcode.decoder.ECB(14, 122)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(6, 47), new com.google.zxing.qrcode.decoder.ECB(34, 48)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(46, 24), new com.google.zxing.qrcode.decoder.ECB(10, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(2, 15), new com.google.zxing.qrcode.decoder.ECB(64, 16))), new com.google.zxing.qrcode.decoder.Version(37, [6, 28, 54, 80, 106, 132, 158], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(17, 122), new com.google.zxing.qrcode.decoder.ECB(4, 123)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(29, 46), new com.google.zxing.qrcode.decoder.ECB(14, 47)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(49, 24), new com.google.zxing.qrcode.decoder.ECB(10, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(24, 15), new com.google.zxing.qrcode.decoder.ECB(46, 16))), new com.google.zxing.qrcode.decoder.Version(38, [6, 32, 58, 84, 110, 136, 162], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(4, 122), new com.google.zxing.qrcode.decoder.ECB(18, 123)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(13, 46), new com.google.zxing.qrcode.decoder.ECB(32, 47)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(48, 24), new com.google.zxing.qrcode.decoder.ECB(14, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(42, 15), new com.google.zxing.qrcode.decoder.ECB(32, 16))), new com.google.zxing.qrcode.decoder.Version(39, [6, 26, 54, 82, 110, 138, 166], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(20, 117), new com.google.zxing.qrcode.decoder.ECB(4, 118)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(40, 47), new com.google.zxing.qrcode.decoder.ECB(7, 48)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(43, 24), new com.google.zxing.qrcode.decoder.ECB(22, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(10, 15), new com.google.zxing.qrcode.decoder.ECB(67, 16))), new com.google.zxing.qrcode.decoder.Version(40, [6, 30, 58, 86, 114, 142, 170], com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(19, 118), new com.google.zxing.qrcode.decoder.ECB(6, 119)), com.google.zxing.qrcode.decoder.ECBlocks.$3(28, new com.google.zxing.qrcode.decoder.ECB(18, 47), new com.google.zxing.qrcode.decoder.ECB(31, 48)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(34, 24), new com.google.zxing.qrcode.decoder.ECB(34, 25)), com.google.zxing.qrcode.decoder.ECBlocks.$3(30, new com.google.zxing.qrcode.decoder.ECB(20, 15), new com.google.zxing.qrcode.decoder.ECB(61, 16)))];
    }
    com.google.zxing.qrcode.decoder.Version.prototype = {
        get_versionNumber: function() {
            return this.$2;
        },
        get_alignmentPatternCenters: function() {
            return this.$3;
        },
        get_totalCodewords: function() {
            return this.$5;
        },
        get_dimensionForVersion: function() {
            return 17 + 4 * this.$2;
        },
        $2: 0,
        $3: null,
        $4: null,
        $5: 0,
        getECBlocksForLevel: function(ecLevel) {
            return this.$4[ecLevel.ordinal()];
        },
        $7: function() {
            var $0 = this.get_dimensionForVersion();
            var $1 = com.google.zxing.common.BitMatrix.createSquareInstance($0);
            $1.setRegion(0, 0, 9, 9);
            $1.setRegion($0 - 8, 0, 8, 9);
            $1.setRegion(0, $0 - 8, 9, 8);
            var $2 = this.$3.length;
            for (var $3 = 0; $3 < $2; $3++) {
                var $4 = this.$3[$3] - 2;
                for (var $5 = 0; $5 < $2; $5++) {
                    if ((!$3 && (!$5 || $5 === $2 - 1)) || ($3 === $2 - 1 && !$5)) {
                        continue;
                    }
                    $1.setRegion(this.$3[$5] - 2, $4, 5, 5);
                }
            }
            $1.setRegion(6, 9, 1, $0 - 17);
            $1.setRegion(9, 6, $0 - 17, 1);
            if (this.$2 > 6) {
                $1.setRegion($0 - 11, 0, 3, 6);
                $1.setRegion(0, $0 - 11, 6, 3);
            }
            return $1;
        },
        toString: function() {
            return this.$2.toString();
        }
    }
    com.google.zxing.qrcode.decoder.ECBlocks = function(ecCodewordsPerBlock, ecBlocks1, ecBlocks2) {
        this.$0 = ecCodewordsPerBlock;
        this.$1 = [ecBlocks1, ecBlocks2];
    }
    com.google.zxing.qrcode.decoder.ECBlocks.$2 = function($p0, $p1) {
        var $0 = com.google.zxing.qrcode.decoder.ECBlocks.$3($p0, $p1, null);
        $0.$5($p1);
        return $0;
    }
    com.google.zxing.qrcode.decoder.ECBlocks.$3 = function($p0, $p1, $p2) {
        var $0 = new com.google.zxing.qrcode.decoder.ECBlocks($p0, $p1, $p2);
        $0.$6($p1, $p2);
        return $0;
    }
    com.google.zxing.qrcode.decoder.ECBlocks.prototype = {
        get_ecCodewordsPerBlock: function() {
            return this.$0;
        },
        get_numBlocks: function() {
            var $0 = 0;
            for (var $1 = 0; $1 < this.$1.length; $1++) {
                $0 += this.$1[$1].get_count();
            }
            return $0;
        },
        get_totalECCodewords: function() {
            return this.$0 * this.get_numBlocks();
        },
        $0: 0,
        $1: null,
        $4: function() {
            return this.$1;
        },
        $5: function($p0) {
            this.$1 = [$p0];
        },
        $6: function($p0, $p1) {
            this.$1 = [$p0, $p1];
        }
    }
    com.google.zxing.qrcode.decoder.ECB = function(count, dataCodewords) {
        this.$0 = count;
        this.$1 = dataCodewords;
    }
    com.google.zxing.qrcode.decoder.ECB.prototype = {
        get_count: function() {
            return this.$0;
        },
        get_dataCodewords: function() {
            return this.$1;
        },
        $0: 0,
        $1: 0
    }
    Type.registerNamespace('com.google.zxing.qrcode.detector');
    com.google.zxing.qrcode.detector.AlignmentPattern = function(posX, posY, estimatedModuleSize) {
        com.google.zxing.qrcode.detector.AlignmentPattern.initializeBase(this, [posX, posY]);
        this.$1 = estimatedModuleSize;
    }
    com.google.zxing.qrcode.detector.AlignmentPattern.prototype = {
        $1: 0,
        $2: function($p0, $p1, $p2) {
            if (Math.abs($p1 - this.get_y()) <= $p0 && Math.abs($p2 - this.get_x()) <= $p0) {
                var $0 = Math.abs($p0 - this.$1);
                return $0 <= 1 || $0 / this.$1 <= 1;
            }
            return false;
        }
    }
    com.google.zxing.qrcode.detector.ZXingQR$2 = function(image, startX, startY, width, height, moduleSize, resultPointCallback) {
        this.$0 = image;
        this.$1 = new Array(5);
        this.$2 = startX;
        this.$3 = startY;
        this.$4 = width;
        this.$5 = height;
        this.$6 = moduleSize;
        this.$7 = new Array(3);
        this.$8 = resultPointCallback;
    }
    com.google.zxing.qrcode.detector.ZXingQR$2.$A = function($p0, $p1) {
        return ($p1 - $p0[2]) - $p0[1] / 2;
    }
    com.google.zxing.qrcode.detector.ZXingQR$2.prototype = {
        $0: null,
        $1: null,
        $2: 0,
        $3: 0,
        $4: 0,
        $5: 0,
        $6: 0,
        $7: null,
        $8: null,
        $9: function() {
            var $0 = this.$2;
            var $1 = this.$5;
            var $2 = $0 + this.$4;
            var $3 = this.$3 + ($1 >> 1);
            var $4 = new Array(3);
            for (var $5 = 0; $5 < $1; $5++) {
                var $6 = $3 + ((!($5 & 1)) ? (($5 + 1) >> 1) : -(($5 + 1) >> 1));
                $4[0] = 0;
                $4[1] = 0;
                $4[2] = 0;
                var $7 = $0;
                while ($7 < $2 && !this.$0.get_Renamed($7, $6)) {
                    $7++;
                }
                var $8 = 0;
                while ($7 < $2) {
                    if (this.$0.get_Renamed($7, $6)) {
                        if ($8 === 1) {
                            $4[$8]++;
                        } else {
                            if ($8 === 2) {
                                if (this.$B($4)) {
                                    var $9 = this.$D($4, $6, $7);
                                    if ($9 != null) {
                                        return $9;
                                    }
                                }
                                $4[0] = $4[2];
                                $4[1] = 1;
                                $4[2] = 0;
                                $8 = 1;
                            } else {
                                $4[++$8]++;
                            }
                        }
                    } else {
                        if ($8 === 1) {
                            $8++;
                        }
                        $4[$8]++;
                    }
                    $7++;
                }
                if (this.$B($4)) {
                    var $A = this.$D($4, $6, $2);
                    if ($A != null) {
                        return $A;
                    }
                }
            }
            if (!(!this.$1.length)) {
                return this.$1[0];
            }
            throw new Error('ReaderException');
        },
        $B: function($p0) {
            var $0 = this.$6;
            var $1 = $0 / 2;
            for (var $2 = 0; $2 < 3; $2++) {
                if (Math.abs($0 - $p0[$2]) >= $1) {
                    return false;
                }
            }
            return true;
        },
        $C: function($p0, $p1, $p2, $p3) {
            var $0 = this.$0;
            var $1 = $0.get_height();
            var $2 = this.$7;
            $2[0] = 0;
            $2[1] = 0;
            $2[2] = 0;
            var $3 = $p0;
            while ($3 >= 0 && $0.get_Renamed($p1, $3) && $2[1] <= $p2) {
                $2[1]++;
                $3--;
            }
            if ($3 < 0 || $2[1] > $p2) {
                return SystemExtend.SingleExtend.naN;
            }
            while ($3 >= 0 && !$0.get_Renamed($p1, $3) && $2[0] <= $p2) {
                $2[0]++;
                $3--;
            }
            if ($2[0] > $p2) {
                return SystemExtend.SingleExtend.naN;
            }
            $3 = $p0 + 1;
            while ($3 < $1 && $0.get_Renamed($p1, $3) && $2[1] <= $p2) {
                $2[1]++;
                $3++;
            }
            if ($3 === $1 || $2[1] > $p2) {
                return SystemExtend.SingleExtend.naN;
            }
            while ($3 < $1 && !$0.get_Renamed($p1, $3) && $2[2] <= $p2) {
                $2[2]++;
                $3++;
            }
            if ($2[2] > $p2) {
                return SystemExtend.SingleExtend.naN;
            }
            var $4 = $2[0] + $2[1] + $2[2];
            if (5 * Math.abs($4 - $p3) >= 2 * $p3) {
                return SystemExtend.SingleExtend.naN;
            }
            return (this.$B($2)) ? com.google.zxing.qrcode.detector.ZXingQR$2.$A($2, $3) : SystemExtend.SingleExtend.naN;
        },
        $D: function($p0, $p1, $p2) {
            var $0 = $p0[0] + $p0[1] + $p0[2];
            var $1 = com.google.zxing.qrcode.detector.ZXingQR$2.$A($p0, $p2);
            var $2 = this.$C($p1, Math.floor($1), 2 * $p0[1], $0);
            if (!SystemExtend.SingleExtend.isNaN($2)) {
                var $3 = ($p0[0] + $p0[1] + $p0[2]) / 3;
                var $4 = this.$1.length;
                for (var $6 = 0; $6 < $4; $6++) {
                    var $7 = this.$1[$6];
                    if ($7.$2($3, $2, $1)) {
                        return new com.google.zxing.qrcode.detector.AlignmentPattern($1, $2, $3);
                    }
                }
                var $5 = new com.google.zxing.qrcode.detector.AlignmentPattern($1, $2, $3);
                this.$1.add($5);
                if (this.$8 != null) {
                    this.$8.foundPossibleResultPoint($5);
                }
            }
            return null;
        }
    }
    com.google.zxing.qrcode.detector.Detector = function(image) {
        this.$0 = image;
    }
    com.google.zxing.qrcode.detector.Detector.$2 = function($p0, $p1, $p2) {
        var $0 = com.google.zxing.common.GridSampler.get_instance();
        return $0.sampleGrid2($p0, $p2, $p1);
    }
    com.google.zxing.qrcode.detector.Detector.computeDimension = function(topLeft, topRight, bottomLeft, moduleSize) {
        var $0 = com.google.zxing.qrcode.detector.Detector.$6(com.google.zxing.ResultPoint.distance(topLeft, topRight) / moduleSize);
        var $1 = com.google.zxing.qrcode.detector.Detector.$6(com.google.zxing.ResultPoint.distance(topLeft, bottomLeft) / moduleSize);
        var $2 = (($0 + $1) >> 1) + 7;
        switch ($2 & 3) {
            case 0:
                $2++;
                break;
            case 2:
                $2--;
                break;
            case 3:
                throw new Error('ReaderException');
        }
        return $2;
    }
    com.google.zxing.qrcode.detector.Detector.$6 = function($p0) {
        return Math.floor($p0 + 0.5);
    }
    com.google.zxing.qrcode.detector.Detector.prototype = {
        get_image: function() {
            return this.$0;
        },
        get_resultPointCallback: function() {
            return this.$1;
        },
        $0: null,
        $1: null,
        detect1: function() {
            return this.detect2(null);
        },
        detect2: function(hints) {
            this.$1 = (hints == null) ? null : hints[com.google.zxing.DecodeHintType.neeD_RESULT_POINT_CALLBACK];
            var $0 = new com.google.zxing.qrcode.detector.FinderPatternFinder(this.$0, this.$1);
            var $1 = $0.$8(hints);
            return this.processFinderPatternInfo($1);
        },
        processFinderPatternInfo: function(info) {
            var $0 = info.get_topLeft();
            var $1 = info.get_topRight();
            var $2 = info.get_bottomLeft();
            var $3 = this.calculateModuleSize($0, $1, $2);
            if ($3 < 1) {
                throw new Error('ReaderException');
            }
            var $4 = com.google.zxing.qrcode.detector.Detector.computeDimension($0, $1, $2, $3);
            var $5 = com.google.zxing.qrcode.decoder.Version.getProvisionalVersionForDimension($4);
            var $6 = $5.get_dimensionForVersion() - 7;
            var $7 = null;
            if ($5.get_alignmentPatternCenters().length > 0) {
                var $B = $1.get_x() - $0.get_x() + $2.get_x();
                var $C = $1.get_y() - $0.get_y() + $2.get_y();
                var $D = 1 - 3 / $6;
                var $E = Math.floor($0.get_x() + $D * ($B - $0.get_x()));
                var $F = Math.floor($0.get_y() + $D * ($C - $0.get_y()));
                for (var $10 = 4; $10 <= 16; $10 <<= 1) {
                    try {
                        $7 = this.findAlignmentInRegion($3, $E, $F, $10);
                        break;
                    } catch ($11) {
                        if ($11.message.indexOf('ReaderException') < 0) {
                            throw $11;
                        }
                    }
                }
            }
            var $8 = this.createTransform($0, $1, $2, $7, $4);
            var $9 = com.google.zxing.qrcode.detector.Detector.$2(this.$0, $8, $4);
            var $A;
            if ($7 == null) {
                $A = [$2, $0, $1];
            } else {
                $A = [$2, $0, $1, $7];
            }
            return new com.google.zxing.common.DetectorResult($9, $A);
        },
        createTransform: function(topLeft, topRight, bottomLeft, alignmentPattern, dimension) {
            var $0 = dimension - 3.5;
            var $1;
            var $2;
            var $3;
            var $4;
            if (alignmentPattern != null) {
                $1 = alignmentPattern.get_x();
                $2 = alignmentPattern.get_y();
                $3 = $4 = $0 - 3;
            } else {
                $1 = (topRight.get_x() - topLeft.get_x()) + bottomLeft.get_x();
                $2 = (topRight.get_y() - topLeft.get_y()) + bottomLeft.get_y();
                $3 = $4 = $0;
            }
            var $5 = com.google.zxing.common.PerspectiveTransform.quadrilateralToQuadrilateral(3.5, 3.5, $0, 3.5, $3, $4, 3.5, $0, topLeft.get_x(), topLeft.get_y(), topRight.get_x(), topRight.get_y(), $1, $2, bottomLeft.get_x(), bottomLeft.get_y());
            return $5;
        },
        calculateModuleSize: function(topLeft, topRight, bottomLeft) {
            return (this.$3(topLeft, topRight) + this.$3(topLeft, bottomLeft)) / 2;
        },
        $3: function($p0, $p1) {
            var $0 = this.$4(Math.floor($p0.get_x()), Math.floor($p0.get_y()), Math.floor($p1.get_x()), Math.floor($p1.get_y()));
            var $1 = this.$4(Math.floor($p1.get_x()), Math.floor($p1.get_y()), Math.floor($p0.get_x()), Math.floor($p0.get_y()));
            if (SystemExtend.SingleExtend.isNaN($0)) {
                return $1 / 7;
            }
            if (SystemExtend.SingleExtend.isNaN($1)) {
                return $0 / 7;
            }
            return ($0 + $1) / 14;
        },
        $4: function($p0, $p1, $p2, $p3) {
            var $0 = this.$5($p0, $p1, $p2, $p3);
            var $1 = 1;
            var $2 = $p0 - ($p2 - $p0);
            if ($2 < 0) {
                $1 = $p0 / ($p0 - $2);
                $2 = 0;
            } else if ($2 >= this.$0.get_width()) {
                $1 = (this.$0.get_width() - 1 - $p0) / ($2 - $p0);
                $2 = this.$0.get_width() - 1;
            }
            var $3 = Math.floor($p1 - ($p3 - $p1) * $1);
            $1 = 1;
            if ($3 < 0) {
                $1 = $p1 / ($p1 - $3);
                $3 = 0;
            } else if ($3 >= this.$0.get_height()) {
                $1 = (this.$0.get_height() - 1 - $p1) / ($3 - $p1);
                $3 = this.$0.get_height() - 1;
            }
            $2 = Math.floor($p0 + ($2 - $p0) * $1);
            $0 += this.$5($p0, $p1, $2, $3);
            return $0 - 1;
        },
        $5: function($p0, $p1, $p2, $p3) {
            var $0 = Math.abs($p3 - $p1) > Math.abs($p2 - $p0);
            if ($0) {
                var $9 = $p0;
                $p0 = $p1;
                $p1 = $9;
                $9 = $p2;
                $p2 = $p3;
                $p3 = $9;
            }
            var $1 = Math.abs($p2 - $p0);
            var $2 = Math.abs($p3 - $p1);
            var $3 = -$1 >> 1;
            var $4 = ($p1 < $p3) ? 1 : -1;
            var $5 = ($p0 < $p2) ? 1 : -1;
            var $6 = 0;
            for (var $A = $p0, $B = $p1; $A !== $p2; $A += $5) {
                var $C = ($0) ? $B : $A;
                var $D = ($0) ? $A : $B;
                if ($6 === 1) {
                    if (this.$0.get_Renamed($C, $D)) {
                        $6++;
                    }
                } else {
                    if (!this.$0.get_Renamed($C, $D)) {
                        $6++;
                    }
                }
                if ($6 === 3) {
                    var $E = $A - $p0;
                    var $F = $B - $p1;
                    return Math.sqrt(($E * $E + $F * $F));
                }
                $3 += $2;
                if ($3 > 0) {
                    if ($B === $p3) {
                        break;
                    }
                    $B += $4;
                    $3 -= $1;
                }
            }
            var $7 = $p2 - $p0;
            var $8 = $p3 - $p1;
            return Math.sqrt(($7 * $7 + $8 * $8));
        },
        findAlignmentInRegion: function(overallEstModuleSize, estAlignmentX, estAlignmentY, allowanceFactor) {
            var $0 = Math.floor(allowanceFactor * overallEstModuleSize);
            var $1 = Math.max(0, estAlignmentX - $0);
            var $2 = Math.min(this.$0.get_width() - 1, estAlignmentX + $0);
            if ($2 - $1 < overallEstModuleSize * 3) {
                throw new Error('ReaderException');
            }
            var $3 = Math.max(0, estAlignmentY - $0);
            var $4 = Math.min(this.$0.get_height() - 1, estAlignmentY + $0);
            var $5 = new com.google.zxing.qrcode.detector.ZXingQR$2(this.$0, $1, $3, $2 - $1, $4 - $3, overallEstModuleSize, this.$1);
            return $5.$9();
        }
    }
    com.google.zxing.qrcode.detector.FinderPattern = function(posX, posY, estimatedModuleSize) {
        com.google.zxing.qrcode.detector.FinderPattern.initializeBase(this, [posX, posY]);
        this.$2 = estimatedModuleSize;
        this.$3 = 1;
    }
    com.google.zxing.qrcode.detector.FinderPattern.prototype = {
        get_estimatedModuleSize: function() {
            return this.$2;
        },
        get_$1: function() {
            return this.$3;
        },
        $2: 0,
        $3: 0,
        $4: function() {
            this.$3++;
        },
        $5: function($p0, $p1, $p2) {
            if (Math.abs($p1 - this.get_y()) <= $p0 && Math.abs($p2 - this.get_x()) <= $p0) {
                var $0 = Math.abs($p0 - this.$2);
                return $0 <= 1 || $0 / this.$2 <= 1;
            }
            return false;
        }
    }
    com.google.zxing.qrcode.detector.FinderPatternFinder = function(image, resultPointCallback) {
        this.$3 = image;
        this.$4 = [];
        this.$6 = new Array(5);
        this.$7 = resultPointCallback;
    }
    com.google.zxing.qrcode.detector.FinderPatternFinder.$9 = function($p0, $p1) {
        return ($p1 - $p0[4] - $p0[3]) - $p0[2] / 2;
    }
    com.google.zxing.qrcode.detector.FinderPatternFinder.foundPatternCross = function(stateCount) {
        var $0 = 0;
        for (var $3 = 0; $3 < 5; $3++) {
            var $4 = stateCount[$3];
            if (!$4) {
                return false;
            }
            $0 += $4;
        }
        if ($0 < 7) {
            return false;
        }
        var $1 = Math.floor(($0 << 8) / 7);
        var $2 = Math.floor($1 / 2);
        return Math.abs($1 - (stateCount[0] << 8)) < $2 && Math.abs($1 - (stateCount[1] << 8)) < $2 && Math.abs(3 * $1 - (stateCount[2] << 8)) < 3 * $2 && Math.abs($1 - (stateCount[3] << 8)) < $2 && Math.abs($1 - (stateCount[4] << 8)) < $2;
    }
    com.google.zxing.qrcode.detector.FinderPatternFinder.prototype = {
        get_image: function() {
            return this.$3;
        },
        get_possibleCenters: function() {
            return this.$4;
        },
        get_$0: function() {
            this.$6[0] = 0;
            this.$6[1] = 0;
            this.$6[2] = 0;
            this.$6[3] = 0;
            this.$6[4] = 0;
            return this.$6;
        },
        $3: null,
        $4: null,
        $5: false,
        $6: null,
        $7: null,
        $8: function($p0) {
            var $0 = $p0 != null && Object.keyExists($p0, com.google.zxing.DecodeHintType.trY_HARDER);
            var $1 = this.$3.get_height();
            var $2 = this.$3.get_width();
            var $3 = Math.floor((3 * $1) / (4 * 57));
            if ($3 < 3 || $0) {
                $3 = 3;
            }
            var $4 = false;
            var $5 = new Array(5);
            for (var $7 = $3 - 1; $7 < $1 && !$4; $7 += $3) {
                $5[0] = 0;
                $5[1] = 0;
                $5[2] = 0;
                $5[3] = 0;
                $5[4] = 0;
                var $8 = 0;
                for (var $9 = 0; $9 < $2; $9++) {
                    if (this.$3.get_Renamed($9, $7)) {
                        if (($8 & 1) === 1) {
                            $8++;
                        }
                        $5[$8]++;
                    } else {
                        if (!($8 & 1)) {
                            if ($8 === 4) {
                                if (com.google.zxing.qrcode.detector.FinderPatternFinder.foundPatternCross($5)) {
                                    var $A = this.handlePossibleCenter($5, $7, $9);
                                    if ($A) {
                                        $3 = 2;
                                        if (this.$5) {
                                            $4 = this.$D();
                                        } else {
                                            var $B = this.$C();
                                            if ($B > $5[2]) {
                                                $7 += $B - $5[2] - $3;
                                                $9 = $2 - 1;
                                            }
                                        }
                                    } else {
                                        do {
                                            $9++;
                                        } while ($9 < $2 && !this.$3.get_Renamed($9, $7));
                                        $9--;
                                    }
                                    $8 = 0;
                                    $5[0] = 0;
                                    $5[1] = 0;
                                    $5[2] = 0;
                                    $5[3] = 0;
                                    $5[4] = 0;
                                } else {
                                    $5[0] = $5[2];
                                    $5[1] = $5[3];
                                    $5[2] = $5[4];
                                    $5[3] = 1;
                                    $5[4] = 0;
                                    $8 = 3;
                                }
                            } else {
                                $5[++$8]++;
                            }
                        } else {
                            $5[$8]++;
                        }
                    }
                }
                if (com.google.zxing.qrcode.detector.FinderPatternFinder.foundPatternCross($5)) {
                    var $C = this.handlePossibleCenter($5, $7, $2);
                    if ($C) {
                        $3 = $5[0];
                        if (this.$5) {
                            $4 = this.$D();
                        }
                    }
                }
            }
            var $6 = this.$E();
            com.google.zxing.ResultPoint.orderBestPatterns($6);
            return new com.google.zxing.qrcode.detector.FinderPatternInfo($6);
        },
        $A: function($p0, $p1, $p2, $p3) {
            var $0 = this.$3;
            var $1 = $0.get_height();
            var $2 = this.get_$0();
            var $3 = $p0;
            while ($3 >= 0 && $0.get_Renamed($p1, $3)) {
                $2[2]++;
                $3--;
            }
            if ($3 < 0) {
                return SystemExtend.SingleExtend.naN;
            }
            while ($3 >= 0 && !$0.get_Renamed($p1, $3) && $2[1] <= $p2) {
                $2[1]++;
                $3--;
            }
            if ($3 < 0 || $2[1] > $p2) {
                return SystemExtend.SingleExtend.naN;
            }
            while ($3 >= 0 && $0.get_Renamed($p1, $3) && $2[0] <= $p2) {
                $2[0]++;
                $3--;
            }
            if ($2[0] > $p2) {
                return SystemExtend.SingleExtend.naN;
            }
            $3 = $p0 + 1;
            while ($3 < $1 && $0.get_Renamed($p1, $3)) {
                $2[2]++;
                $3++;
            }
            if ($3 === $1) {
                return SystemExtend.SingleExtend.naN;
            }
            while ($3 < $1 && !$0.get_Renamed($p1, $3) && $2[3] < $p2) {
                $2[3]++;
                $3++;
            }
            if ($3 === $1 || $2[3] >= $p2) {
                return SystemExtend.SingleExtend.naN;
            }
            while ($3 < $1 && $0.get_Renamed($p1, $3) && $2[4] < $p2) {
                $2[4]++;
                $3++;
            }
            if ($2[4] >= $p2) {
                return SystemExtend.SingleExtend.naN;
            }
            var $4 = $2[0] + $2[1] + $2[2] + $2[3] + $2[4];
            if (5 * Math.abs($4 - $p3) >= 2 * $p3) {
                return SystemExtend.SingleExtend.naN;
            }
            return (com.google.zxing.qrcode.detector.FinderPatternFinder.foundPatternCross($2)) ? com.google.zxing.qrcode.detector.FinderPatternFinder.$9($2, $3) : SystemExtend.SingleExtend.naN;
        },
        $B: function($p0, $p1, $p2, $p3) {
            var $0 = this.$3;
            var $1 = $0.get_width();
            var $2 = this.get_$0();
            var $3 = $p0;
            while ($3 >= 0 && $0.get_Renamed($3, $p1)) {
                $2[2]++;
                $3--;
            }
            if ($3 < 0) {
                return SystemExtend.SingleExtend.naN;
            }
            while ($3 >= 0 && !$0.get_Renamed($3, $p1) && $2[1] <= $p2) {
                $2[1]++;
                $3--;
            }
            if ($3 < 0 || $2[1] > $p2) {
                return SystemExtend.SingleExtend.naN;
            }
            while ($3 >= 0 && $0.get_Renamed($3, $p1) && $2[0] <= $p2) {
                $2[0]++;
                $3--;
            }
            if ($2[0] > $p2) {
                return SystemExtend.SingleExtend.naN;
            }
            $3 = $p0 + 1;
            while ($3 < $1 && $0.get_Renamed($3, $p1)) {
                $2[2]++;
                $3++;
            }
            if ($3 === $1) {
                return SystemExtend.SingleExtend.naN;
            }
            while ($3 < $1 && !$0.get_Renamed($3, $p1) && $2[3] < $p2) {
                $2[3]++;
                $3++;
            }
            if ($3 === $1 || $2[3] >= $p2) {
                return SystemExtend.SingleExtend.naN;
            }
            while ($3 < $1 && $0.get_Renamed($3, $p1) && $2[4] < $p2) {
                $2[4]++;
                $3++;
            }
            if ($2[4] >= $p2) {
                return SystemExtend.SingleExtend.naN;
            }
            var $4 = $2[0] + $2[1] + $2[2] + $2[3] + $2[4];
            if (5 * Math.abs($4 - $p3) >= $p3) {
                return SystemExtend.SingleExtend.naN;
            }
            return (com.google.zxing.qrcode.detector.FinderPatternFinder.foundPatternCross($2)) ? com.google.zxing.qrcode.detector.FinderPatternFinder.$9($2, $3) : SystemExtend.SingleExtend.naN;
        },
        handlePossibleCenter: function(stateCount, i, j) {
            var $0 = stateCount[0] + stateCount[1] + stateCount[2] + stateCount[3] + stateCount[4];
            var $1 = com.google.zxing.qrcode.detector.FinderPatternFinder.$9(stateCount, j);
            var $2 = this.$A(i, Math.floor($1), stateCount[2], $0);
            if (!SystemExtend.SingleExtend.isNaN($2)) {
                $1 = this.$B(Math.floor($1), Math.floor($2), stateCount[2], $0);
                if (!SystemExtend.SingleExtend.isNaN($1)) {
                    var $3 = $0 / 7;
                    var $4 = false;
                    var $5 = this.$4.length;
                    for (var $6 = 0; $6 < $5; $6++) {
                        var $7 = this.$4[$6];
                        if ($7.$5($3, $2, $1)) {
                            $7.$4();
                            $4 = true;
                            break;
                        }
                    }
                    if (!$4) {
                        var $8 = new com.google.zxing.qrcode.detector.FinderPattern($1, $2, $3);
                        this.$4.add($8);
                        if (this.$7 != null) {
                            this.$7.foundPossibleResultPoint($8);
                        }
                    }
                    return true;
                }
            }
            return false;
        },
        $C: function() {
            var $0 = this.$4.length;
            if ($0 <= 1) {
                return 0;
            }
            var $1 = null;
            for (var $2 = 0; $2 < $0; $2++) {
                var $3 = this.$4[$2];
                if ($3.get_$1() >= 2) {
                    if ($1 == null) {
                        $1 = $3;
                    } else {
                        this.$5 = true;
                        return Math.floor((Math.abs($1.get_x() - $3.get_x()) - Math.abs($1.get_y() - $3.get_y())) / 2);
                    }
                }
            }
            return 0;
        },
        $D: function() {
            var $0 = 0;
            var $1 = 0;
            var $2 = this.$4.length;
            for (var $5 = 0; $5 < $2; $5++) {
                var $6 = this.$4[$5];
                if ($6.get_$1() >= 2) {
                    $0++;
                    $1 += $6.get_estimatedModuleSize();
                }
            }
            if ($0 < 3) {
                return false;
            }
            var $3 = $1 / $2;
            var $4 = 0;
            for (var $7 = 0; $7 < $2; $7++) {
                var $8 = this.$4[$7];
                $4 += Math.abs($8.get_estimatedModuleSize() - $3);
            }
            return $4 <= 0.05 * $1;
        },
        $E: function() {
            var $0 = this.$4.length;
            if ($0 < 3) {
                throw new Error('ReaderException');
            }
            if ($0 > 3) {
                var $1 = 0;
                for (var $3 = 0; $3 < $0; $3++) {
                    $1 += (this.$4[$3]).get_estimatedModuleSize();
                }
                var $2 = $1 / $0;
                for (var $4 = 0; $4 < this.$4.length && this.$4.length > 3; $4++) {
                    var $5 = this.$4[$4];
                    if (Math.abs($5.get_estimatedModuleSize() - $2) > 0.2 * $2) {
                        this.$4.removeAt($4);
                        $4--;
                    }
                }
            }
            if (this.$4.length > 3) {
                com.google.zxing.common.Collections.insertionSort(this.$4, new com.google.zxing.qrcode.detector.ZXingQR$0());
                SupportClass.setCapacity(this.$4, 3);
            }
            return [this.$4[0], this.$4[1], this.$4[2]];
        }
    }
    com.google.zxing.qrcode.detector.ZXingQR$0 = function() {}
    com.google.zxing.qrcode.detector.ZXingQR$0.prototype = {
        compare: function($p0, $p1) {
            return ($p1).get_$1() - ($p0).get_$1();
        }
    }
    com.google.zxing.qrcode.detector.FinderPatternInfo = function(patternCenters) {
        this.$0 = patternCenters[0];
        this.$1 = patternCenters[1];
        this.$2 = patternCenters[2];
    }
    com.google.zxing.qrcode.detector.FinderPatternInfo.prototype = {
        get_bottomLeft: function() {
            return this.$0;
        },
        get_topLeft: function() {
            return this.$1;
        },
        get_topRight: function() {
            return this.$2;
        },
        $0: null,
        $1: null,
        $2: null
    }
    Type.registerNamespace('com.google.zxing.qrcode.encoder');
    com.google.zxing.qrcode.encoder.BitVector = function() {
        this.$0 = 0;
        this.$1 = new Array(32);
    }
    com.google.zxing.qrcode.encoder.BitVector.prototype = {
        get_array: function() {
            return this.$1;
        },
        $0: 0,
        $1: null,
        at: function(index) {
            if (index < 0 || index >= this.$0) {
                throw new Error('ArgumentException: Bad index: ' + index);
            }
            var $0 = this.$1[index >> 3] & 255;
            return ($0 >> (7 - (index & 7))) & 1;
        },
        size: function() {
            return this.$0;
        },
        sizeInBytes: function() {
            return (this.$0 + 7) >> 3;
        },
        appendBit: function(bit) {
            if (!(!bit || bit === 1)) {
                throw new Error('ArgumentException: Bad bit');
            }
            var $0 = this.$0 & 7;
            if (!$0) {
                this.$3(0);
                this.$0 -= 8;
            }
            this.$1[this.$0 >> 3] |= (bit << (7 - $0));
            ++this.$0;
        },
        appendBits: function(value_Renamed, numBits) {
            if (numBits < 0 || numBits > 32) {
                throw new Error('ArgumentException: Num bits must be between 0 and 32');
            }
            var $0 = numBits;
            while ($0 > 0) {
                if (!(this.$0 & 7) && $0 >= 8) {
                    var $1 = (value_Renamed >> ($0 - 8)) & 255;
                    this.$3($1);
                    $0 -= 8;
                } else {
                    var $2 = (value_Renamed >> ($0 - 1)) & 1;
                    this.appendBit($2);
                    --$0;
                }
            }
        },
        appendBitVector: function(bits) {
            var $0 = bits.size();
            for (var $1 = 0; $1 < $0; ++$1) {
                this.appendBit(bits.at($1));
            }
        },
        xor: function(other) {
            if (this.$0 !== other.size()) {
                throw new Error("ArgumentException: BitVector sizes don't match");
            }
            var $0 = (this.$0 + 7) >> 3;
            for (var $1 = 0; $1 < $0; ++$1) {
                this.$1[$1] ^= other.$1[$1];
            }
        },
        toString: function() {
            var $0 = new ss.StringBuilder();
            for (var $1 = 0; $1 < this.$0; ++$1) {
                if (!this.at($1)) {
                    $0.append('0');
                } else if (this.at($1) === 1) {
                    $0.append('1');
                } else {
                    throw new Error("ArgumentException: Byte isn't 0 or 1");
                }
            }
            return $0.toString();
        },
        $3: function($p0) {
            if ((this.$0 >> 3) === this.$1.length) {
                var $0 = new Array((this.$1.length << 1));
                SystemExtend.ArrayExtend.copy(this.$1, 0, $0, 0, this.$1.length);
                this.$1 = $0;
            }
            this.$1[this.$0 >> 3] = $p0;
            this.$0 += 8;
        }
    }
    com.google.zxing.qrcode.encoder.ZXingQR$1 = function(data, errorCorrection) {
        this.$2 = data;
        this.$3 = errorCorrection;
    }
    com.google.zxing.qrcode.encoder.ZXingQR$1.prototype = {
        get_$0: function() {
            return this.$2;
        },
        get_$1: function() {
            return this.$3;
        },
        $2: null,
        $3: null
    }
    com.google.zxing.qrcode.encoder.Encoder = function() {}
    com.google.zxing.qrcode.encoder.Encoder.$2 = function($p0) {
        var $0 = 0;
        $0 += com.google.zxing.qrcode.encoder.MaskUtil.applyMaskPenaltyRule1($p0);
        $0 += com.google.zxing.qrcode.encoder.MaskUtil.applyMaskPenaltyRule2($p0);
        $0 += com.google.zxing.qrcode.encoder.MaskUtil.applyMaskPenaltyRule3($p0);
        $0 += com.google.zxing.qrcode.encoder.MaskUtil.applyMaskPenaltyRule4($p0);
        return $0;
    }
    com.google.zxing.qrcode.encoder.Encoder.encode1 = function(content, ecLevel, qrCode) {
        com.google.zxing.qrcode.encoder.Encoder.encode2(content, ecLevel, null, qrCode);
    }
    com.google.zxing.qrcode.encoder.Encoder.encode2 = function(content, ecLevel, hints, qrCode) {
        var $0 = (hints == null) ? null : hints[com.google.zxing.EncodeHintType.characteR_SET];
        if ($0 == null) {
            $0 = 'ISO-8859-1';
        }
        var $1 = com.google.zxing.qrcode.encoder.Encoder.chooseMode2(content, $0);
        var $2 = new com.google.zxing.qrcode.encoder.BitVector();
        com.google.zxing.qrcode.encoder.Encoder.$D(content, $1, $2, $0);
        var $3 = $2.sizeInBytes();
        com.google.zxing.qrcode.encoder.Encoder.$6($3, ecLevel, $1, qrCode);
        var $4 = new com.google.zxing.qrcode.encoder.BitVector();
        if ($1 === com.google.zxing.qrcode.decoder.Mode.BYTE && !('ISO-8859-1' === $0)) {
            var $8 = com.google.zxing.common.CharacterSetECI.getCharacterSetECIByName($0);
            if ($8 != null) {
                com.google.zxing.qrcode.encoder.Encoder.$12($8, $4);
            }
        }
        com.google.zxing.qrcode.encoder.Encoder.$B($1, $4);
        var $5 = ($1 === com.google.zxing.qrcode.decoder.Mode.BYTE) ? $2.sizeInBytes() : content.length;
        com.google.zxing.qrcode.encoder.Encoder.$C($5, qrCode.get_version(), $1, $4);
        $4.appendBitVector($2);
        com.google.zxing.qrcode.encoder.Encoder.$7(qrCode.get_numDataBytes(), $4);
        var $6 = new com.google.zxing.qrcode.encoder.BitVector();
        com.google.zxing.qrcode.encoder.Encoder.$9($4, qrCode.get_numTotalBytes(), qrCode.get_numDataBytes(), qrCode.get_numRSBlocks(), $6);
        var $7 = new com.google.zxing.common.ByteMatrix(qrCode.get_matrixWidth(), qrCode.get_matrixWidth());
        qrCode.set_maskPattern(com.google.zxing.qrcode.encoder.Encoder.$5($6, qrCode.get_ecLevel(), qrCode.get_version(), $7));
        com.google.zxing.qrcode.encoder.MatrixUtil.buildMatrix($6, qrCode.get_ecLevel(), qrCode.get_version(), qrCode.get_maskPattern(), $7);
        qrCode.set_matrix($7);
        if (!qrCode.get_valid()) {
            throw new Error('WriterException: Invalid QR code: ' + qrCode.toString());
        }
    }
    com.google.zxing.qrcode.encoder.Encoder.$3 = function($p0) {
        if ($p0 < com.google.zxing.qrcode.encoder.Encoder.$0.length) {
            return com.google.zxing.qrcode.encoder.Encoder.$0[$p0];
        }
        return -1;
    }
    com.google.zxing.qrcode.encoder.Encoder.chooseMode1 = function(content) {
        return com.google.zxing.qrcode.encoder.Encoder.chooseMode2(content, null);
    }
    com.google.zxing.qrcode.encoder.Encoder.chooseMode2 = function(content, encoding) {
        if ('Shift_JIS' === encoding) {
            return (com.google.zxing.qrcode.encoder.Encoder.$4(content)) ? com.google.zxing.qrcode.decoder.Mode.KANJI : com.google.zxing.qrcode.decoder.Mode.BYTE;
        }
        var $0 = false;
        var $1 = false;
        for (var $2 = 0; $2 < content.length; ++$2) {
            var $3 = content.charAt($2);
            if (SystemExtend.CharExtend.toInt32($3) >= SystemExtend.CharExtend.toInt32('0') && SystemExtend.CharExtend.toInt32($3) <= SystemExtend.CharExtend.toInt32('9')) {
                $0 = true;
            } else if (com.google.zxing.qrcode.encoder.Encoder.$3(SystemExtend.CharExtend.toInt32($3)) !== -1) {
                $1 = true;
            } else {
                return com.google.zxing.qrcode.decoder.Mode.BYTE;
            }
        }
        if ($1) {
            return com.google.zxing.qrcode.decoder.Mode.ALPHANUMERIC;
        } else if ($0) {
            return com.google.zxing.qrcode.decoder.Mode.NUMERIC;
        }
        return com.google.zxing.qrcode.decoder.Mode.BYTE;
    }
    com.google.zxing.qrcode.encoder.Encoder.$4 = function($p0) {
        var $0;
        try {
            $0 = SupportClass.toSByteArray(SystemExtend.Text.Encoding.getEncoding('Shift_JIS').getBytes($p0));
        } catch ($2) {
            return false;
        }
        var $1 = $0.length;
        if (!!($1 % 2)) {
            return false;
        }
        for (var $3 = 0; $3 < $1; $3 += 2) {
            var $4 = $0[$3] & 255;
            if (($4 < 129 || $4 > 159) && ($4 < 224 || $4 > 235)) {
                return false;
            }
        }
        return true;
    }
    com.google.zxing.qrcode.encoder.Encoder.$5 = function($p0, $p1, $p2, $p3) {
        var $0 = SystemExtend.Int32Extend.maxValue;
        var $1 = -1;
        for (var $2 = 0; $2 < 8; $2++) {
            com.google.zxing.qrcode.encoder.MatrixUtil.buildMatrix($p0, $p1, $p2, $2, $p3);
            var $3 = com.google.zxing.qrcode.encoder.Encoder.$2($p3);
            if ($3 < $0) {
                $0 = $3;
                $1 = $2;
            }
        }
        return $1;
    }
    com.google.zxing.qrcode.encoder.Encoder.$6 = function($p0, $p1, $p2, $p3) {
        $p3.set_ecLevel($p1);
        $p3.set_mode($p2);
        for (var $0 = 1; $0 <= 40; $0++) {
            var $1 = com.google.zxing.qrcode.decoder.Version.getVersionForNumber($0);
            var $2 = $1.get_totalCodewords();
            var $3 = $1.getECBlocksForLevel($p1);
            var $4 = $3.get_totalECCodewords();
            var $5 = $3.get_numBlocks();
            var $6 = $2 - $4;
            if ($6 >= $p0 + 3) {
                $p3.set_version($0);
                $p3.set_numTotalBytes($2);
                $p3.set_numDataBytes($6);
                $p3.set_numRSBlocks($5);
                $p3.set_numECBytes($4);
                $p3.set_matrixWidth($1.get_dimensionForVersion());
                return;
            }
        }
        throw new Error('WriterException: Cannot find proper rs block info (input data too big?)');
    }
    com.google.zxing.qrcode.encoder.Encoder.$7 = function($p0, $p1) {
        var $0 = $p0 << 3;
        if ($p1.size() > $0) {
            throw new Error('WriterException: data bits cannot fit in the QR Code' + $p1.size() + ' > ' + $0);
        }
        for (var $3 = 0; $3 < 4 && $p1.size() < $0; ++$3) {
            $p1.appendBit(0);
        }
        var $1 = $p1.size() % 8;
        if ($1 > 0) {
            var $4 = 8 - $1;
            for (var $5 = 0; $5 < $4; ++$5) {
                $p1.appendBit(0);
            }
        }
        if (!!($p1.size() % 8)) {
            throw new Error('WriterException: Number of bits is not a multiple of 8');
        }
        var $2 = $p0 - $p1.sizeInBytes();
        for (var $6 = 0; $6 < $2; ++$6) {
            if (!($6 % 2)) {
                $p1.appendBits(236, 8);
            } else {
                $p1.appendBits(17, 8);
            }
        }
        if ($p1.size() !== $0) {
            throw new Error('WriterException: Bits size does not equal capacity');
        }
    }
    com.google.zxing.qrcode.encoder.Encoder.$8 = function($p0, $p1, $p2, $p3, $p4, $p5) {
        if ($p3 >= $p2) {
            throw new Error('WriterException: Block ID too large');
        }
        var $0 = $p0 % $p2;
        var $1 = $p2 - $0;
        var $2 = Math.floor($p0 / $p2);
        var $3 = $2 + 1;
        var $4 = Math.floor($p1 / $p2);
        var $5 = $4 + 1;
        var $6 = $2 - $4;
        var $7 = $3 - $5;
        if ($6 !== $7) {
            throw new Error('WriterException: EC bytes mismatch');
        }
        if ($p2 !== $1 + $0) {
            throw new Error('WriterException: RS blocks mismatch');
        }
        if ($p0 !== (($4 + $6) * $1) + (($5 + $7) * $0)) {
            throw new Error('WriterException: Total bytes mismatch');
        }
        if ($p3 < $1) {
            $p4[0] = $4;
            $p5[0] = $6;
        } else {
            $p4[0] = $5;
            $p5[0] = $7;
        }
    }
    com.google.zxing.qrcode.encoder.Encoder.$9 = function($p0, $p1, $p2, $p3, $p4) {
        if ($p0.sizeInBytes() !== $p2) {
            throw new Error('WriterException: Number of bits and data bytes does not match');
        }
        var $0 = 0;
        var $1 = 0;
        var $2 = 0;
        var $3 = new Array($p3);
        for (var $4 = 0; $4 < $p3; ++$4) {
            var $5 = new Array(1);
            var $6 = new Array(1);
            com.google.zxing.qrcode.encoder.Encoder.$8($p1, $p2, $p3, $4, $5, $6);
            var $7 = new com.google.zxing.common.ByteArray(0);
            $7.set_Renamed2($p0.get_array(), $0, $5[0]);
            var $8 = com.google.zxing.qrcode.encoder.Encoder.$A($7, $6[0]);
            $3.add(new com.google.zxing.qrcode.encoder.ZXingQR$1($7, $8));
            $1 = Math.max($1, $7.size());
            $2 = Math.max($2, $8.size());
            $0 += $5[0];
        }
        if ($p2 !== $0) {
            throw new Error('WriterException: Data bytes does not match offset');
        }
        for (var $9 = 0; $9 < $1; ++$9) {
            for (var $A = 0; $A < $3.length; ++$A) {
                var $B = ($3[$A]).get_$0();
                if ($9 < $B.size()) {
                    $p4.appendBits($B.at($9), 8);
                }
            }
        }
        for (var $C = 0; $C < $2; ++$C) {
            for (var $D = 0; $D < $3.length; ++$D) {
                var $E = ($3[$D]).get_$1();
                if ($C < $E.size()) {
                    $p4.appendBits($E.at($C), 8);
                }
            }
        }
        if ($p1 !== $p4.sizeInBytes()) {
            throw new Error('WriterException: Interleaving error: ' + $p1 + ' and ' + $p4.sizeInBytes() + ' differ.');
        }
    }
    com.google.zxing.qrcode.encoder.Encoder.$A = function($p0, $p1) {
        var $0 = $p0.size();
        var $1 = new Array($0 + $p1);
        for (var $3 = 0; $3 < $0; $3++) {
            $1[$3] = $p0.at($3);
        }
        new com.google.zxing.common.reedsolomon.ReedSolomonEncoder(com.google.zxing.common.reedsolomon.GF256.qR_CODE_FIELD).encode($1, $p1);
        var $2 = new com.google.zxing.common.ByteArray($p1);
        for (var $4 = 0; $4 < $p1; $4++) {
            $2.set_Renamed1($4, $1[$0 + $4]);
        }
        return $2;
    }
    com.google.zxing.qrcode.encoder.Encoder.$B = function($p0, $p1) {
        $p1.appendBits($p0.get_bits(), 4);
    }
    com.google.zxing.qrcode.encoder.Encoder.$C = function($p0, $p1, $p2, $p3) {
        var $0 = $p2.getCharacterCountBits(com.google.zxing.qrcode.decoder.Version.getVersionForNumber($p1));
        if ($p0 > ((1 << $0) - 1)) {
            throw new Error('WriterException: ' + $p0 + 'is bigger than' + ((1 << $0) - 1));
        }
        $p3.appendBits($p0, $0);
    }
    com.google.zxing.qrcode.encoder.Encoder.$D = function($p0, $p1, $p2, $p3) {
        if ($p1.equals(com.google.zxing.qrcode.decoder.Mode.NUMERIC)) {
            com.google.zxing.qrcode.encoder.Encoder.$E($p0, $p2);
        } else if ($p1.equals(com.google.zxing.qrcode.decoder.Mode.ALPHANUMERIC)) {
            com.google.zxing.qrcode.encoder.Encoder.$F($p0, $p2);
        } else if ($p1.equals(com.google.zxing.qrcode.decoder.Mode.BYTE)) {
            com.google.zxing.qrcode.encoder.Encoder.$10($p0, $p2, $p3);
        } else if ($p1.equals(com.google.zxing.qrcode.decoder.Mode.KANJI)) {
            com.google.zxing.qrcode.encoder.Encoder.$11($p0, $p2);
        } else {
            throw new Error('WriterException: Invalid mode: ' + $p1);
        }
    }
    com.google.zxing.qrcode.encoder.Encoder.$E = function($p0, $p1) {
        var $0 = $p0.length;
        var $1 = 0;
        while ($1 < $0) {
            var $2 = $p0.charCodeAt($1) - SystemExtend.CharExtend.toInt32('0');
            if ($1 + 2 < $0) {
                var $3 = $p0.charCodeAt($1 + 1) - SystemExtend.CharExtend.toInt32('0');
                var $4 = $p0.charCodeAt($1 + 2) - SystemExtend.CharExtend.toInt32('0');
                $p1.appendBits($2 * 100 + $3 * 10 + $4, 10);
                $1 += 3;
            } else if ($1 + 1 < $0) {
                var $5 = $p0.charCodeAt($1 + 1) - SystemExtend.CharExtend.toInt32('0');
                $p1.appendBits($2 * 10 + $5, 7);
                $1 += 2;
            } else {
                $p1.appendBits($2, 4);
                $1++;
            }
        }
    }
    com.google.zxing.qrcode.encoder.Encoder.$F = function($p0, $p1) {
        var $0 = $p0.length;
        var $1 = 0;
        while ($1 < $0) {
            var $2 = com.google.zxing.qrcode.encoder.Encoder.$3($p0.charCodeAt($1));
            if ($2 === -1) {
                throw new Error('WriterException');
            }
            if ($1 + 1 < $0) {
                var $3 = com.google.zxing.qrcode.encoder.Encoder.$3($p0.charCodeAt($1 + 1));
                if ($3 === -1) {
                    throw new Error('WriterException');
                }
                $p1.appendBits($2 * 45 + $3, 11);
                $1 += 2;
            } else {
                $p1.appendBits($2, 6);
                $1++;
            }
        }
    }
    com.google.zxing.qrcode.encoder.Encoder.$10 = function($p0, $p1, $p2) {
        var $0;
        try {
            $0 = SupportClass.toSByteArray(SystemExtend.Text.Encoding.getEncoding($p2).getBytes($p0));
        } catch ($1) {
            throw new Error('WriterException: ' + $1.toString());
        }
        for (var $2 = 0; $2 < $0.length; ++$2) {
            $p1.appendBits($0[$2], 8);
        }
    }
    com.google.zxing.qrcode.encoder.Encoder.$11 = function($p0, $p1) {
        var $0;
        try {
            $0 = SupportClass.toSByteArray(SystemExtend.Text.Encoding.getEncoding('Shift_JIS').getBytes($p0));
        } catch ($2) {
            throw new Error('WriterException: ' + $2.toString());
        }
        var $1 = $0.length;
        for (var $3 = 0; $3 < $1; $3 += 2) {
            var $4 = $0[$3] & 255;
            var $5 = $0[$3 + 1] & 255;
            var $6 = ($4 << 8) | $5;
            var $7 = -1;
            if ($6 >= 33088 && $6 <= 40956) {
                $7 = $6 - 33088;
            } else if ($6 >= 57408 && $6 <= 60351) {
                $7 = $6 - 49472;
            }
            if ($7 === -1) {
                throw new Error('WriterException: Invalid byte sequence');
            }
            var $8 = (($7 >> 8) * 192) + ($7 & 255);
            $p1.appendBits($8, 13);
        }
    }
    com.google.zxing.qrcode.encoder.Encoder.$12 = function($p0, $p1) {
        $p1.appendBits(com.google.zxing.qrcode.decoder.Mode.ECI.get_bits(), 4);
        $p1.appendBits($p0.get_value(), 8);
    }
    com.google.zxing.qrcode.encoder.MaskUtil = function() {}
    com.google.zxing.qrcode.encoder.MaskUtil.applyMaskPenaltyRule1 = function(matrix) {
        return com.google.zxing.qrcode.encoder.MaskUtil.$0(matrix, true) + com.google.zxing.qrcode.encoder.MaskUtil.$0(matrix, false);
    }
    com.google.zxing.qrcode.encoder.MaskUtil.applyMaskPenaltyRule2 = function(matrix) {
        var $0 = 0;
        var $1 = matrix.get_array();
        var $2 = matrix.get_width();
        var $3 = matrix.get_height();
        for (var $4 = 0; $4 < $3 - 1; ++$4) {
            for (var $5 = 0; $5 < $2 - 1; ++$5) {
                var $6 = $1[$4][$5];
                if ($6 === $1[$4][$5 + 1] && $6 === $1[$4 + 1][$5] && $6 === $1[$4 + 1][$5 + 1]) {
                    $0 += 3;
                }
            }
        }
        return $0;
    }
    com.google.zxing.qrcode.encoder.MaskUtil.applyMaskPenaltyRule3 = function(matrix) {
        var $0 = 0;
        var $1 = matrix.get_array();
        var $2 = matrix.get_width();
        var $3 = matrix.get_height();
        for (var $4 = 0; $4 < $3; ++$4) {
            for (var $5 = 0; $5 < $2; ++$5) {
                if ($5 + 6 < $2 && $1[$4][$5] === 1 && !$1[$4][$5 + 1] && $1[$4][$5 + 2] === 1 && $1[$4][$5 + 3] === 1 && $1[$4][$5 + 4] === 1 && !$1[$4][$5 + 5] && $1[$4][$5 + 6] === 1 && (($5 + 10 < $2 && !$1[$4][$5 + 7] && !$1[$4][$5 + 8] && !$1[$4][$5 + 9] && !$1[$4][$5 + 10]) || ($5 - 4 >= 0 && !$1[$4][$5 - 1] && !$1[$4][$5 - 2] && !$1[$4][$5 - 3] && !$1[$4][$5 - 4]))) {
                    $0 += 40;
                }
                if ($4 + 6 < $3 && $1[$4][$5] === 1 && !$1[$4 + 1][$5] && $1[$4 + 2][$5] === 1 && $1[$4 + 3][$5] === 1 && $1[$4 + 4][$5] === 1 && !$1[$4 + 5][$5] && $1[$4 + 6][$5] === 1 && (($4 + 10 < $3 && !$1[$4 + 7][$5] && !$1[$4 + 8][$5] && !$1[$4 + 9][$5] && !$1[$4 + 10][$5]) || ($4 - 4 >= 0 && !$1[$4 - 1][$5] && !$1[$4 - 2][$5] && !$1[$4 - 3][$5] && !$1[$4 - 4][$5]))) {
                    $0 += 40;
                }
            }
        }
        return $0;
    }
    com.google.zxing.qrcode.encoder.MaskUtil.applyMaskPenaltyRule4 = function(matrix) {
        var $0 = 0;
        var $1 = matrix.get_array();
        var $2 = matrix.get_width();
        var $3 = matrix.get_height();
        for (var $6 = 0; $6 < $3; ++$6) {
            for (var $7 = 0; $7 < $2; ++$7) {
                if ($1[$6][$7] === 1) {
                    $0 += 1;
                }
            }
        }
        var $4 = matrix.get_height() * matrix.get_width();
        var $5 = $0 / $4;
        return Math.floor(Math.abs(Math.floor($5 * 100 - 50)) / 5) * 10;
    }
    com.google.zxing.qrcode.encoder.MaskUtil.getDataMaskBit = function(maskPattern, x, y) {
        if (!com.google.zxing.qrcode.encoder.QRCode.isValidMaskPattern(maskPattern)) {
            throw new Error('ArgumentException: Invalid mask pattern');
        }
        var $0, $1;
        switch (maskPattern) {
            case 0:
                $0 = (y + x) & 1;
                break;
            case 1:
                $0 = y & 1;
                break;
            case 2:
                $0 = x % 3;
                break;
            case 3:
                $0 = (y + x) % 3;
                break;
            case 4:
                $0 = (SupportClass.urShift1(y, 1) + Math.floor(x / 3)) & 1;
                break;
            case 5:
                $1 = y * x;
                $0 = ($1 & 1) + ($1 % 3);
                break;
            case 6:
                $1 = y * x;
                $0 = ((($1 & 1) + ($1 % 3)) & 1);
                break;
            case 7:
                $1 = y * x;
                $0 = ((($1 % 3) + ((y + x) & 1)) & 1);
                break;
            default:
                throw new Error('ArgumentException: Invalid mask pattern: ' + maskPattern);
        }
        return !$0;
    }
    com.google.zxing.qrcode.encoder.MaskUtil.$0 = function($p0, $p1) {
        var $0 = 0;
        var $1 = 0;
        var $2 = -1;
        var $3 = ($p1) ? $p0.get_height() : $p0.get_width();
        var $4 = ($p1) ? $p0.get_width() : $p0.get_height();
        var $5 = $p0.get_array();
        for (var $6 = 0; $6 < $3; ++$6) {
            for (var $7 = 0; $7 < $4; ++$7) {
                var $8 = ($p1) ? $5[$6][$7] : $5[$7][$6];
                if ($8 === $2) {
                    $1 += 1;
                    if ($1 === 5) {
                        $0 += 3;
                    } else if ($1 > 5) {
                        $0 += 1;
                    }
                } else {
                    $1 = 1;
                    $2 = $8;
                }
            }
            $1 = 0;
        }
        return $0;
    }
    com.google.zxing.qrcode.encoder.MatrixUtil = function() {}
    com.google.zxing.qrcode.encoder.MatrixUtil.clearMatrix = function(matrix) {
        matrix.clear((-1));
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.buildMatrix = function(dataBits, ecLevel, version, maskPattern, matrix) {
        com.google.zxing.qrcode.encoder.MatrixUtil.clearMatrix(matrix);
        com.google.zxing.qrcode.encoder.MatrixUtil.embedBasicPatterns(version, matrix);
        com.google.zxing.qrcode.encoder.MatrixUtil.embedTypeInfo(ecLevel, maskPattern, matrix);
        com.google.zxing.qrcode.encoder.MatrixUtil.maybeEmbedVersionInfo(version, matrix);
        com.google.zxing.qrcode.encoder.MatrixUtil.embedDataBits(dataBits, maskPattern, matrix);
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.embedBasicPatterns = function(version, matrix) {
        com.google.zxing.qrcode.encoder.MatrixUtil.$11(matrix);
        com.google.zxing.qrcode.encoder.MatrixUtil.$C(matrix);
        com.google.zxing.qrcode.encoder.MatrixUtil.$12(version, matrix);
        com.google.zxing.qrcode.encoder.MatrixUtil.$B(matrix);
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.embedTypeInfo = function(ecLevel, maskPattern, matrix) {
        var $0 = new com.google.zxing.qrcode.encoder.BitVector();
        com.google.zxing.qrcode.encoder.MatrixUtil.makeTypeInfoBits(ecLevel, maskPattern, $0);
        for (var $1 = 0; $1 < $0.size(); ++$1) {
            var $2 = $0.at($0.size() - 1 - $1);
            var $3 = com.google.zxing.qrcode.encoder.MatrixUtil.$5[$1][0];
            var $4 = com.google.zxing.qrcode.encoder.MatrixUtil.$5[$1][1];
            matrix.set_Renamed($3, $4, $2);
            if ($1 < 8) {
                var $5 = matrix.get_width() - $1 - 1;
                var $6 = 8;
                matrix.set_Renamed($5, $6, $2);
            } else {
                var $7 = 8;
                var $8 = matrix.get_height() - 7 + ($1 - 8);
                matrix.set_Renamed($7, $8, $2);
            }
        }
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.maybeEmbedVersionInfo = function(version, matrix) {
        if (version < 7) {
            return;
        }
        var $0 = new com.google.zxing.qrcode.encoder.BitVector();
        com.google.zxing.qrcode.encoder.MatrixUtil.makeVersionInfoBits(version, $0);
        var $1 = 6 * 3 - 1;
        for (var $2 = 0; $2 < 6; ++$2) {
            for (var $3 = 0; $3 < 3; ++$3) {
                var $4 = $0.at($1);
                $1--;
                matrix.set_Renamed($2, matrix.get_height() - 11 + $3, $4);
                matrix.set_Renamed(matrix.get_height() - 11 + $3, $2, $4);
            }
        }
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.embedDataBits = function(dataBits, maskPattern, matrix) {
        var $0 = 0;
        var $1 = -1;
        var $2 = matrix.get_width() - 1;
        var $3 = matrix.get_height() - 1;
        while ($2 > 0) {
            if ($2 === 6) {
                $2 -= 1;
            }
            while ($3 >= 0 && $3 < matrix.get_height()) {
                for (var $4 = 0; $4 < 2; ++$4) {
                    var $5 = $2 - $4;
                    if (!com.google.zxing.qrcode.encoder.MatrixUtil.$9(matrix.get_Renamed($5, $3))) {
                        continue;
                    }
                    var $6;
                    if ($0 < dataBits.size()) {
                        $6 = dataBits.at($0);
                        ++$0;
                    } else {
                        $6 = 0;
                    }
                    if (maskPattern !== -1) {
                        if (com.google.zxing.qrcode.encoder.MaskUtil.getDataMaskBit(maskPattern, $5, $3)) {
                            $6 ^= 1;
                        }
                    }
                    matrix.set_Renamed($5, $3, $6);
                }
                $3 += $1;
            }
            $1 = -$1;
            $3 += $1;
            $2 -= 2;
        }
        if ($0 !== dataBits.size()) {
            throw new Error('WriterException: Not all bits consumed: ' + $0 + '/' + dataBits.size());
        }
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.findMSBSet = function(value_Renamed) {
        var $0 = 0;
        while (!!value_Renamed) {
            value_Renamed = SupportClass.urShift1(value_Renamed, 1);
            ++$0;
        }
        return $0;
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.calculateBCHCode = function(value_Renamed, poly) {
        var $0 = com.google.zxing.qrcode.encoder.MatrixUtil.findMSBSet(poly);
        value_Renamed <<= $0 - 1;
        while (com.google.zxing.qrcode.encoder.MatrixUtil.findMSBSet(value_Renamed) >= $0) {
            value_Renamed ^= poly << (com.google.zxing.qrcode.encoder.MatrixUtil.findMSBSet(value_Renamed) - $0);
        }
        return value_Renamed;
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.makeTypeInfoBits = function(ecLevel, maskPattern, bits) {
        if (!com.google.zxing.qrcode.encoder.QRCode.isValidMaskPattern(maskPattern)) {
            throw new Error('WriterException: Invalid mask pattern');
        }
        var $0 = (ecLevel.get_bits() << 3) | maskPattern;
        bits.appendBits($0, 5);
        var $1 = com.google.zxing.qrcode.encoder.MatrixUtil.calculateBCHCode($0, 1335);
        bits.appendBits($1, 10);
        var $2 = new com.google.zxing.qrcode.encoder.BitVector();
        $2.appendBits(21522, 15);
        bits.xor($2);
        if (bits.size() !== 15) {
            throw new Error('WriterException: should not happen but we got: ' + bits.size());
        }
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.makeVersionInfoBits = function(version, bits) {
        bits.appendBits(version, 6);
        var $0 = com.google.zxing.qrcode.encoder.MatrixUtil.calculateBCHCode(version, 7973);
        bits.appendBits($0, 12);
        if (bits.size() !== 18) {
            throw new Error('WriterException: should not happen but we got: ' + bits.size());
        }
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.$9 = function($p0) {
        return $p0 === -1;
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.$A = function($p0) {
        return ($p0 === -1 || !$p0 || $p0 === 1);
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.$B = function($p0) {
        for (var $0 = 8; $0 < $p0.get_width() - 8; ++$0) {
            var $1 = ($0 + 1) % 2;
            if (!com.google.zxing.qrcode.encoder.MatrixUtil.$A($p0.get_Renamed($0, 6))) {
                throw new Error('WriterException');
            }
            if (com.google.zxing.qrcode.encoder.MatrixUtil.$9($p0.get_Renamed($0, 6))) {
                $p0.set_Renamed($0, 6, $1);
            }
            if (!com.google.zxing.qrcode.encoder.MatrixUtil.$A($p0.get_Renamed(6, $0))) {
                throw new Error('WriterException');
            }
            if (com.google.zxing.qrcode.encoder.MatrixUtil.$9($p0.get_Renamed(6, $0))) {
                $p0.set_Renamed(6, $0, $1);
            }
        }
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.$C = function($p0) {
        if (!$p0.get_Renamed(8, $p0.get_height() - 8)) {
            throw new Error('WriterException');
        }
        $p0.set_Renamed(8, $p0.get_height() - 8, 1);
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.$D = function($p0, $p1, $p2) {
        if (com.google.zxing.qrcode.encoder.MatrixUtil.$1[0].length !== 8 || com.google.zxing.qrcode.encoder.MatrixUtil.$1.length !== 1) {
            throw new Error('WriterException: Bad horizontal separation pattern');
        }
        for (var $0 = 0; $0 < 8; ++$0) {
            if (!com.google.zxing.qrcode.encoder.MatrixUtil.$9($p2.get_Renamed($p0 + $0, $p1))) {
                throw new Error('WriterException');
            }
            $p2.set_Renamed($p0 + $0, $p1, com.google.zxing.qrcode.encoder.MatrixUtil.$1[0][$0]);
        }
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.$E = function($p0, $p1, $p2) {
        if (com.google.zxing.qrcode.encoder.MatrixUtil.$2[0].length !== 1 || com.google.zxing.qrcode.encoder.MatrixUtil.$2.length !== 7) {
            throw new Error('WriterException: Bad vertical separation pattern');
        }
        for (var $0 = 0; $0 < 7; ++$0) {
            if (!com.google.zxing.qrcode.encoder.MatrixUtil.$9($p2.get_Renamed($p0, $p1 + $0))) {
                throw new Error('WriterException');
            }
            $p2.set_Renamed($p0, $p1 + $0, com.google.zxing.qrcode.encoder.MatrixUtil.$2[$0][0]);
        }
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.$F = function($p0, $p1, $p2) {
        if (com.google.zxing.qrcode.encoder.MatrixUtil.$3[0].length !== 5 || com.google.zxing.qrcode.encoder.MatrixUtil.$3.length !== 5) {
            throw new Error('WriterException: Bad position adjustment');
        }
        for (var $0 = 0; $0 < 5; ++$0) {
            for (var $1 = 0; $1 < 5; ++$1) {
                if (!com.google.zxing.qrcode.encoder.MatrixUtil.$9($p2.get_Renamed($p0 + $1, $p1 + $0))) {
                    throw new Error('WriterException');
                }
                $p2.set_Renamed($p0 + $1, $p1 + $0, com.google.zxing.qrcode.encoder.MatrixUtil.$3[$0][$1]);
            }
        }
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.$10 = function($p0, $p1, $p2) {
        if (com.google.zxing.qrcode.encoder.MatrixUtil.$0[0].length !== 7 || com.google.zxing.qrcode.encoder.MatrixUtil.$0.length !== 7) {
            throw new Error('WriterException: Bad position detection pattern');
        }
        for (var $0 = 0; $0 < 7; ++$0) {
            for (var $1 = 0; $1 < 7; ++$1) {
                if (!com.google.zxing.qrcode.encoder.MatrixUtil.$9($p2.get_Renamed($p0 + $1, $p1 + $0))) {
                    throw new Error('WriterException');
                }
                $p2.set_Renamed($p0 + $1, $p1 + $0, com.google.zxing.qrcode.encoder.MatrixUtil.$0[$0][$1]);
            }
        }
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.$11 = function($p0) {
        var $0 = com.google.zxing.qrcode.encoder.MatrixUtil.$0[0].length;
        com.google.zxing.qrcode.encoder.MatrixUtil.$10(0, 0, $p0);
        com.google.zxing.qrcode.encoder.MatrixUtil.$10($p0.get_width() - $0, 0, $p0);
        com.google.zxing.qrcode.encoder.MatrixUtil.$10(0, $p0.get_width() - $0, $p0);
        var $1 = com.google.zxing.qrcode.encoder.MatrixUtil.$1[0].length;
        com.google.zxing.qrcode.encoder.MatrixUtil.$D(0, $1 - 1, $p0);
        com.google.zxing.qrcode.encoder.MatrixUtil.$D($p0.get_width() - $1, $1 - 1, $p0);
        com.google.zxing.qrcode.encoder.MatrixUtil.$D(0, $p0.get_width() - $1, $p0);
        var $2 = com.google.zxing.qrcode.encoder.MatrixUtil.$2.length;
        com.google.zxing.qrcode.encoder.MatrixUtil.$E($2, 0, $p0);
        com.google.zxing.qrcode.encoder.MatrixUtil.$E($p0.get_height() - $2 - 1, 0, $p0);
        com.google.zxing.qrcode.encoder.MatrixUtil.$E($2, $p0.get_height() - $2, $p0);
    }
    com.google.zxing.qrcode.encoder.MatrixUtil.$12 = function($p0, $p1) {
        if ($p0 < 2) {
            return;
        }
        var $0 = $p0 - 1;
        var $1 = com.google.zxing.qrcode.encoder.MatrixUtil.$4[$0];
        var $2 = com.google.zxing.qrcode.encoder.MatrixUtil.$4[$0].length;
        for (var $3 = 0; $3 < $2; ++$3) {
            for (var $4 = 0; $4 < $2; ++$4) {
                var $5 = $1[$3];
                var $6 = $1[$4];
                if ($6 === -1 || $5 === -1) {
                    continue;
                }
                if (com.google.zxing.qrcode.encoder.MatrixUtil.$9($p1.get_Renamed($6, $5))) {
                    com.google.zxing.qrcode.encoder.MatrixUtil.$F($6 - 2, $5 - 2, $p1);
                }
            }
        }
    }
    com.google.zxing.qrcode.encoder.QRCode = function() {
        this.$0 = null;
        this.$1 = null;
        this.$2 = -1;
        this.$3 = -1;
        this.$4 = -1;
        this.$5 = -1;
        this.$6 = -1;
        this.$7 = -1;
        this.$8 = -1;
        this.$9 = null;
    }
    com.google.zxing.qrcode.encoder.QRCode.isValidMaskPattern = function(maskPattern) {
        return maskPattern >= 0 && maskPattern < 8;
    }
    com.google.zxing.qrcode.encoder.QRCode.prototype = {
        get_mode: function() {
            return this.$0;
        },
        set_mode: function(value) {
            this.$0 = value;
            return value;
        },
        get_ecLevel: function() {
            return this.$1;
        },
        set_ecLevel: function(value) {
            this.$1 = value;
            return value;
        },
        get_version: function() {
            return this.$2;
        },
        set_version: function(value) {
            this.$2 = value;
            return value;
        },
        get_matrixWidth: function() {
            return this.$3;
        },
        set_matrixWidth: function(value) {
            this.$3 = value;
            return value;
        },
        get_maskPattern: function() {
            return this.$4;
        },
        set_maskPattern: function(value) {
            this.$4 = value;
            return value;
        },
        get_numTotalBytes: function() {
            return this.$5;
        },
        set_numTotalBytes: function(value) {
            this.$5 = value;
            return value;
        },
        get_numDataBytes: function() {
            return this.$6;
        },
        set_numDataBytes: function(value) {
            this.$6 = value;
            return value;
        },
        get_numECBytes: function() {
            return this.$7;
        },
        set_numECBytes: function(value) {
            this.$7 = value;
            return value;
        },
        get_numRSBlocks: function() {
            return this.$8;
        },
        set_numRSBlocks: function(value) {
            this.$8 = value;
            return value;
        },
        get_matrix: function() {
            return this.$9;
        },
        set_matrix: function(value) {
            this.$9 = value;
            return value;
        },
        get_valid: function() {
            return this.$0 != null && this.$1 != null && this.$2 !== -1 && this.$3 !== -1 && this.$4 !== -1 && this.$5 !== -1 && this.$6 !== -1 && this.$7 !== -1 && this.$8 !== -1 && com.google.zxing.qrcode.encoder.QRCode.isValidMaskPattern(this.$4) && this.$5 === this.$6 + this.$7 && this.$9 != null && this.$3 === this.$9.get_width() && this.$9.get_width() === this.$9.get_height();
        },
        $0: null,
        $1: null,
        $2: 0,
        $3: 0,
        $4: 0,
        $5: 0,
        $6: 0,
        $7: 0,
        $8: 0,
        $9: null,
        at: function(x, y) {
            var $0 = this.$9.get_Renamed(x, y);
            if (!(!$0 || $0 === 1)) {
                throw new Error('SystemExpection: Bad value');
            }
            return $0;
        },
        toString: function() {
            var $0 = new ss.StringBuilder();
            $0.append('<<\n');
            $0.append(' mode: ');
            $0.append(this.$0);
            $0.append('\n ecLevel: ');
            $0.append(this.$1);
            $0.append('\n version: ');
            $0.append(this.$2);
            $0.append('\n matrixWidth: ');
            $0.append(this.$3);
            $0.append('\n maskPattern: ');
            $0.append(this.$4);
            $0.append('\n numTotalBytes: ');
            $0.append(this.$5);
            $0.append('\n numDataBytes: ');
            $0.append(this.$6);
            $0.append('\n numECBytes: ');
            $0.append(this.$7);
            $0.append('\n numRSBlocks: ');
            $0.append(this.$8);
            if (this.$9 == null) {
                $0.append('\n matrix: null\n');
            } else {
                $0.append('\n matrix:\n');
                $0.append(this.$9.toString());
            }
            $0.append('>>\n');
            return $0.toString();
        }
    }
    Type.registerNamespace('com.google.zxing.qrcode');
    com.google.zxing.qrcode.QRCodeReader = function() {
        this.$1 = new com.google.zxing.qrcode.decoder.Decoder();
    }
    com.google.zxing.qrcode.QRCodeReader.$2 = function($p0) {
        var $0 = $p0.get_height();
        var $1 = $p0.get_width();
        var $2 = Math.min($0, $1);
        var $3 = 0;
        while ($3 < $2 && !$p0.get_Renamed($3, $3)) {
            $3++;
        }
        if ($3 === $2) {
            throw new Error('ReaderException');
        }
        var $4 = $3;
        while ($4 < $2 && $p0.get_Renamed($4, $4)) {
            $4++;
        }
        if ($4 === $2) {
            throw new Error('ReaderException');
        }
        var $5 = $4 - $3;
        var $6 = $1 - 1;
        while ($6 >= 0 && !$p0.get_Renamed($6, $3)) {
            $6--;
        }
        if ($6 < 0) {
            throw new Error('ReaderException');
        }
        $6++;
        if (!!(($6 - $3) % $5)) {
            throw new Error('ReaderException');
        }
        var $7 = Math.floor(($6 - $3) / $5);
        $3 += ($5 >> 1);
        var $8 = $3 + ($7 - 1) * $5;
        if ($8 >= $1 || $8 >= $0) {
            throw new Error('ReaderException');
        }
        var $9 = com.google.zxing.common.BitMatrix.createSquareInstance($7);
        for (var $A = 0; $A < $7; $A++) {
            var $B = $3 + $A * $5;
            for (var $C = 0; $C < $7; $C++) {
                if ($p0.get_Renamed($3 + $C * $5, $B)) {
                    $9.set_Renamed($C, $A);
                }
            }
        }
        return $9;
    }
    com.google.zxing.qrcode.QRCodeReader.prototype = {
        get_decoder: function() {
            return this.$1;
        },
        decode1: function(image) {
            return this.decode2(image, null);
        },
        decode2: function(image, hints) {
            var $0;
            var $1;
            if (hints != null && Object.keyExists(hints, com.google.zxing.DecodeHintType.purE_BARCODE)) {
                var $3 = com.google.zxing.qrcode.QRCodeReader.$2(image.get_blackMatrix());
                $0 = this.$1.decode2($3);
                $1 = com.google.zxing.qrcode.QRCodeReader.$0;
            } else {
                var $4 = new com.google.zxing.qrcode.detector.Detector(image.get_blackMatrix()).detect2(hints);
                $0 = this.$1.decode2($4.get_bits());
                $1 = $4.get_points();
            }
            var $2 = new com.google.zxing.Result($0.get_text(), $0.get_rawBytes(), $1, com.google.zxing.BarcodeFormat.qR_CODE);
            if ($0.get_byteSegments() != null) {
                $2.putMetadata(com.google.zxing.ResultMetadataType.bytE_SEGMENTS, $0.get_byteSegments());
            }
            if ($0.get_ecLevel() != null) {
                $2.putMetadata(com.google.zxing.ResultMetadataType.erroR_CORRECTION_LEVEL, $0.get_ecLevel().toString());
            }
            return $2;
        }
    }
    com.google.zxing.qrcode.QRCodeWriter = function() {}
    com.google.zxing.qrcode.QRCodeWriter.$1 = function($p0, $p1, $p2) {
        var $0 = $p0.get_matrix();
        var $1 = $0.get_width();
        var $2 = $0.get_height();
        var $3 = $1 + (4 << 1);
        var $4 = $2 + (4 << 1);
        var $5 = Math.max($p1, $3);
        var $6 = Math.max($p2, $4);
        var $7 = Math.min(Math.floor($5 / $3), Math.floor($6 / $4));
        var $8 = Math.floor(($5 - ($1 * $7)) / 2);
        var $9 = Math.floor(($6 - ($2 * $7)) / 2);
        var $A = new com.google.zxing.common.ByteMatrix($5, $6);
        var $B = $A.get_array();
        var $C = new Array($5);
        for (var $F = 0; $F < $9; $F++) {
            com.google.zxing.qrcode.QRCodeWriter.$2($B[$F], SupportClass.identity1(255));
        }
        var $D = $0.get_array();
        for (var $10 = 0; $10 < $2; $10++) {
            for (var $12 = 0; $12 < $8; $12++) {
                $C[$12] = SupportClass.identity1(255);
            }
            var $11 = $8;
            for (var $13 = 0; $13 < $1; $13++) {
                var $14 = (($D[$10][$13] === 1) ? 0 : SupportClass.identity1(255));
                for (var $15 = 0; $15 < $7; $15++) {
                    $C[$11 + $15] = $14;
                }
                $11 += $7;
            }
            $11 = $8 + ($1 * $7);
            for (var $16 = $11; $16 < $5; $16++) {
                $C[$16] = SupportClass.identity1(255);
            }
            $11 = $9 + ($10 * $7);
            for (var $17 = 0; $17 < $7; $17++) {
                SystemExtend.ArrayExtend.copy($C, 0, $B[$11 + $17], 0, $5);
            }
        }
        var $E = $9 + ($2 * $7);
        for (var $18 = $E; $18 < $6; $18++) {
            com.google.zxing.qrcode.QRCodeWriter.$2($B[$18], SupportClass.identity1(255));
        }
        return $A;
    }
    com.google.zxing.qrcode.QRCodeWriter.$2 = function($p0, $p1) {
        for (var $0 = 0; $0 < $p0.length; $0++) {
            $p0[$0] = $p1;
        }
    }
    com.google.zxing.qrcode.QRCodeWriter.prototype = {
        encode: function(contents, format, width, height) {
            return this.encode1(contents, format, width, height, null);
        },
        encode1: function(contents, format, width, height, hints) {
            if (contents == null || !contents.length) {
                throw new Error('ArgumentException: Found empty contents');
            }
            if (format !== com.google.zxing.BarcodeFormat.qR_CODE) {
                throw new Error('ArgumentException: Can only encode QR_CODE, but got ' + format);
            }
            if (width < 0 || height < 0) {
                throw new Error('ArgumentException: Requested dimensions are too small: ' + width + 'x' + height);
            }
            var $0 = com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.l;
            if (hints != null) {
                var $2 = hints[com.google.zxing.EncodeHintType.erroR_CORRECTION];
                if ($2 != null) {
                    $0 = $2;
                }
            }
            var $1 = new com.google.zxing.qrcode.encoder.QRCode();
            com.google.zxing.qrcode.encoder.Encoder.encode2(contents, $0, hints, $1);
            return com.google.zxing.qrcode.QRCodeWriter.$1($1, width, height);
        }
    }
    Type.registerNamespace('com.google.zxing');
    com.google.zxing.Reader = function() {};
    com.google.zxing.Reader.registerInterface('com.google.zxing.Reader');
    com.google.zxing.ResultPointCallback = function() {};
    com.google.zxing.ResultPointCallback.registerInterface('com.google.zxing.ResultPointCallback');
    com.google.zxing.Writer = function() {};
    com.google.zxing.Writer.registerInterface('com.google.zxing.Writer');
    com.google.zxing.Result = function(text, rawBytes, resultPoints, format) {
        if (text == null && rawBytes == null) {
            throw new Error('ArgumentException: Text and bytes are null');
        }
        this.$0 = text;
        this.$1 = rawBytes;
        this.$2 = resultPoints;
        this.$3 = format;
        this.$4 = null;
    }
    com.google.zxing.Result.prototype = {
        get_text: function() {
            return this.$0;
        },
        get_rawBytes: function() {
            return this.$1;
        },
        get_resultPoints: function() {
            return this.$2;
        },
        get_barcodeFormat: function() {
            return this.$3;
        },
        get_resultMetadata: function() {
            return this.$4;
        },
        $0: null,
        $1: null,
        $2: null,
        $3: null,
        $4: null,
        putMetadata: function(type, value_Renamed) {
            if (this.$4 == null) {
                this.$4 = {};
            }
            this.$4[type] = value_Renamed;
        },
        toString: function() {
            if (this.$0 == null) {
                return '[' + this.$1.length + ' bytes]';
            } else {
                return this.$0;
            }
        }
    }
    com.google.zxing.ResultMetadataType = function() {}
    com.google.zxing.ResultPoint = function(x, y) {
        this.x = x;
        this.y = y;
    }
    com.google.zxing.ResultPoint.orderBestPatterns = function(patterns) {
        var $0 = com.google.zxing.ResultPoint.distance(patterns[0], patterns[1]);
        var $1 = com.google.zxing.ResultPoint.distance(patterns[1], patterns[2]);
        var $2 = com.google.zxing.ResultPoint.distance(patterns[0], patterns[2]);
        var $3, $4, $5;
        if ($1 >= $0 && $1 >= $2) {
            $4 = patterns[0];
            $3 = patterns[1];
            $5 = patterns[2];
        } else if ($2 >= $1 && $2 >= $0) {
            $4 = patterns[1];
            $3 = patterns[0];
            $5 = patterns[2];
        } else {
            $4 = patterns[2];
            $3 = patterns[0];
            $5 = patterns[1];
        }
        if (com.google.zxing.ResultPoint.$0($3, $4, $5) < 0) {
            var $6 = $3;
            $3 = $5;
            $5 = $6;
        }
        patterns[0] = $3;
        patterns[1] = $4;
        patterns[2] = $5;
    }
    com.google.zxing.ResultPoint.distance = function(pattern1, pattern2) {
        var $0 = pattern1.get_x() - pattern2.get_x();
        var $1 = pattern1.get_y() - pattern2.get_y();
        return Math.sqrt(($0 * $0 + $1 * $1));
    }
    com.google.zxing.ResultPoint.$0 = function($p0, $p1, $p2) {
        var $0 = $p1.x;
        var $1 = $p1.y;
        return (($p2.x - $0) * ($p0.y - $1)) - (($p2.y - $1) * ($p0.x - $0));
    }
    com.google.zxing.ResultPoint.prototype = {
        get_x: function() {
            return this.x;
        },
        get_y: function() {
            return this.y;
        },
        x: 0,
        y: 0,
        equals: function(other) {
            if (Type.canCast(other, com.google.zxing.ResultPoint)) {
                var $0 = other;
                return this.x === $0.x && this.y === $0.y;
            }
            return false;
        },
        getHashCode: function() {
            return 0;
        },
        toString: function() {
            var $0 = new ss.StringBuilder();
            $0.append('(');
            $0.append(this.x);
            $0.append(',');
            $0.append(this.y);
            $0.append(')');
            return $0.toString();
        }
    }
    com.google.zxing.BarcodeFormat = function(name) {
        this.$1 = name;
        com.google.zxing.BarcodeFormat.$0[name] = this;
    }
    com.google.zxing.BarcodeFormat.valueOf = function(name) {
        var $0 = com.google.zxing.BarcodeFormat.$0[name];
        if ($0 == null) {
            throw new Error('ArgumentException');
        }
        return $0;
    }
    com.google.zxing.BarcodeFormat.prototype = {
        get_name: function() {
            return this.$1;
        },
        $1: null,
        toString: function() {
            return this.$1;
        }
    }
    com.google.zxing.Binarizer = function(source) {
        if (source == null) {
            throw new Error('Source must be non-null.');
        }
        this.$0 = source;
    }
    com.google.zxing.Binarizer.prototype = {
        get_luminanceSource: function() {
            return this.$0;
        },
        $0: null
    }
    com.google.zxing.BinaryBitmap = function(binarizer) {
        if (binarizer == null) {
            throw new Error('Binarizer must be non-null.');
        }
        this.$0 = binarizer;
        this.$1 = null;
    }
    com.google.zxing.BinaryBitmap.prototype = {
        get_width: function() {
            return this.$0.get_luminanceSource().get_width();
        },
        get_height: function() {
            return this.$0.get_luminanceSource().get_height();
        },
        get_blackMatrix: function() {
            if (this.$1 == null) {
                this.$1 = this.$0.get_blackMatrix();
            }
            return this.$1;
        },
        get_cropSupported: function() {
            return this.$0.get_luminanceSource().get_cropSupported();
        },
        get_rotateSupported: function() {
            return this.$0.get_luminanceSource().get_rotateSupported();
        },
        $0: null,
        $1: null,
        getBlackRow: function(y, row) {
            return this.$0.getBlackRow(y, row);
        },
        crop: function(left, top, width, height) {
            var $0 = this.$0.get_luminanceSource().crop(left, top, width, height);
            return new com.google.zxing.BinaryBitmap(this.$0.createBinarizer($0));
        },
        rotateCounterClockwise: function() {
            var $0 = this.$0.get_luminanceSource().rotateCounterClockwise();
            return new com.google.zxing.BinaryBitmap(this.$0.createBinarizer($0));
        }
    }
    com.google.zxing.DecodeHintType = function() {}
    com.google.zxing.EncodeHintType = function() {}
    com.google.zxing.LuminanceSource = function(width, height) {
        this.$0 = width;
        this.$1 = height;
    }
    com.google.zxing.LuminanceSource.prototype = {
        get_width: function() {
            return this.$0;
        },
        get_height: function() {
            return this.$1;
        },
        get_cropSupported: function() {
            return false;
        },
        get_rotateSupported: function() {
            return false;
        },
        $0: 0,
        $1: 0,
        crop: function(left, top, width, height) {
            throw new Error('SystemExpection: This luminance source does not support cropping.');
        },
        rotateCounterClockwise: function() {
            throw new Error('SystemExpection: This luminance source does not support rotation.');
        }
    }
    Type.registerNamespace('SystemExtend');
    SystemExtend.ArrayExtend = function() {}
    SystemExtend.ArrayExtend.copy = function(sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
        for (var $0 = 0; $0 < length; $0++) {
            destinationArray[destinationIndex + $0] = sourceArray[sourceIndex + $0];
        }
    }
    SystemExtend.CharExtend = function() {}
    SystemExtend.CharExtend.isDigit = function(val) {
        try {
            var $0 = Number.parse(val);
            return !isNaN($0);
        } catch ($1) {
            return false;
        }
    }
    SystemExtend.CharExtend.toInt32 = function(val) {
        return (val).charCodeAt(0);
    }
    SystemExtend.Int32Extend = function() {}
    SystemExtend.Int32Extend.toChar = function(val) {
        return String.fromCharCode([val]).charAt(0);
    }
    SystemExtend.SingleExtend = function() {}
    SystemExtend.SingleExtend.isNaN = function(val) {
        return isNaN(val);
    }
    SystemExtend.StringExtend = function() {}
    SystemExtend.StringExtend.toCharArray = function(val) {
        var $0 = new Array(val.length);
        for (var $1 = 0; $1 < val.length; $1++) {
            $0[$1] = val.charAt($1);
        }
        return $0;
    }
    Type.registerNamespace('SystemExtend.Drawing');
    SystemExtend.Drawing.Bitmap = function(width, height, pixelFormat) {
        this.$2 = width;
        this.$3 = height;
        this.$1 = pixelFormat;
        if (pixelFormat === 1) {
            this.$0 = new Array(width * height * 1);
        } else {
            throw new Error('ArgumentException');
        }
    }
    SystemExtend.Drawing.Bitmap.prototype = {
        $0: null,
        $1: 0,
        $2: 0,
        $3: 0,
        get_pixelFormat: function() {
            return this.$1;
        },
        set_pixelFormat: function(value) {
            this.$1 = value;
            return value;
        },
        get_width: function() {
            return this.$2;
        },
        set_width: function(value) {
            this.$2 = value;
            return value;
        },
        get_height: function() {
            return this.$3;
        },
        set_height: function(value) {
            this.$3 = value;
            return value;
        },
        lockBits: function(rect, flags, format) {
            return new SystemExtend.Drawing.Imaging.BitmapData(this.$0);
        },
        unlockBits: function(bmpData) {},
        getPixel: function(x, y) {
            return null;
        }
    }
    SystemExtend.Drawing.Color = function() {}
    SystemExtend.Drawing.Color.prototype = {
        r: 0,
        get_r: function() {
            return this.r;
        },
        set_r: function(value) {
            this.r = value;
            return value;
        },
        g: 0,
        get_g: function() {
            return this.g;
        },
        set_g: function(value) {
            this.g = value;
            return value;
        },
        b: 0,
        get_b: function() {
            return this.b;
        },
        set_b: function(value) {
            this.b = value;
            return value;
        }
    }
    SystemExtend.Drawing.Rectangle = function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.$0 = width;
        this.$1 = height;
    }
    SystemExtend.Drawing.Rectangle.prototype = {
        x: 0,
        y: 0,
        $0: 0,
        $1: 0,
        get_width: function() {
            return this.$0;
        },
        set_width: function(value) {
            this.$0 = value;
            return value;
        },
        get_height: function() {
            return this.$1;
        },
        set_height: function(value) {
            this.$1 = value;
            return value;
        }
    }
    Type.registerNamespace('SystemExtend.Drawing.Imaging');
    SystemExtend.Drawing.Imaging.ImageLockMode = function() {};
    SystemExtend.Drawing.Imaging.ImageLockMode.prototype = {
        readOnly: 1,
        readWrite: 2,
        userInputBuffer: 3,
        writeOnly: 4
    }
    SystemExtend.Drawing.Imaging.ImageLockMode.registerEnum('SystemExtend.Drawing.Imaging.ImageLockMode', false);
    SystemExtend.Drawing.Imaging.PixelFormat = function() {};
    SystemExtend.Drawing.Imaging.PixelFormat.prototype = {
        format8bppIndexed: 1
    }
    SystemExtend.Drawing.Imaging.PixelFormat.registerEnum('SystemExtend.Drawing.Imaging.PixelFormat', false);
    SystemExtend.Drawing.Imaging.BitmapData = function(data) {
        this.$0 = data;
    }
    SystemExtend.Drawing.Imaging.BitmapData.prototype = {
        $0: null,
        get_scan0: function() {
            return this.$0;
        },
        set_scan0: function(value) {
            this.$0 = value;
            return value;
        }
    }
    Type.registerNamespace('SystemExtend.Text');
    SystemExtend.Text.Encoding = function(name) {
        this.$0 = name;
    }
    SystemExtend.Text.Encoding.getEncoding = function(name) {
        return new SystemExtend.Text.Encoding('utf-8');
    }
    SystemExtend.Text.Encoding.prototype = {
        $0: null,
        getString: function(bytes) {
            if (bytes == null) {
                return null;
            }
            var $0 = new ss.StringBuilder();
            for (var $1 = 0; $1 < bytes.length; $1++) {
                var $2 = bytes[$1];
                if ($2 <= 127) {
                    $0.append(String.fromCharCode($2));
                } else if ($2 <= 223) {
                    var $3 = (($2 & 31) << 6);
                    $1++;
                    $3 += bytes[$1] & 63;
                    $0.append(String.fromCharCode($3));
                } else if ($2 <= 224) {
                    $1++;
                    var $4 = ((bytes[$1] & 31) << 6) | 2048;
                    $1++;
                    $4 += bytes[$1] & 63;
                    $0.append(String.fromCharCode($4));
                } else {
                    var $5 = (($2 & 15) << 12);
                    $1++;
                    $5 += (bytes[$1] & 63) << 6;
                    $1++;
                    $5 += bytes[$1] & 63;
                    $0.append(String.fromCharCode($5));
                }
            }
            return $0.toString();
        },
        getBytes: function(s) {
            var $0 = [];
            if (s == null) {
                return null;
            }
            for (var $2 = 0; $2 < s.length; $2++) {
                var $3 = s.charCodeAt($2);
                if ($3 <= 127) {
                    $0.add($3);
                } else if ($3 <= 2047) {
                    $0.add(((($3 >> 6) & 31) | 192));
                    $0.add((($3 & 63) | 128));
                } else {
                    $0.add(((($3 >> 12) & 15) | 224));
                    $0.add(((($3 >> 6) & 63) | 128));
                    $0.add((($3 & 63) | 128));
                }
            }
            var $1 = new Array($0.length);
            for (var $4 = 0; $4 < $0.length; $4++) {
                $1[$4] = $0[$4];
            }
            return $1;
        }
    }
    com.google.zxing.LuminanceSource.registerClass('com.google.zxing.LuminanceSource');
    RGBLuminanceSource.registerClass('RGBLuminanceSource', com.google.zxing.LuminanceSource);
    SupportClass.registerClass('SupportClass');
    com.google.zxing.client.result.ResultParser.registerClass('com.google.zxing.client.result.ResultParser');
    com.google.zxing.client.result.ZXingQR$10.registerClass('com.google.zxing.client.result.ZXingQR$10', com.google.zxing.client.result.ResultParser);
    com.google.zxing.client.result.ZXingQR$11.registerClass('com.google.zxing.client.result.ZXingQR$11', com.google.zxing.client.result.ResultParser);
    com.google.zxing.client.result.ZXingQR$1F.registerClass('com.google.zxing.client.result.ZXingQR$1F', com.google.zxing.client.result.ZXingQR$10);
    com.google.zxing.client.result.ParsedResult.registerClass('com.google.zxing.client.result.ParsedResult');
    com.google.zxing.client.result.AddressBookParsedResult.registerClass('com.google.zxing.client.result.AddressBookParsedResult', com.google.zxing.client.result.ParsedResult);
    com.google.zxing.client.result.ZXingQR$1E.registerClass('com.google.zxing.client.result.ZXingQR$1E', com.google.zxing.client.result.ZXingQR$10);
    com.google.zxing.client.result.ZXingQR$20.registerClass('com.google.zxing.client.result.ZXingQR$20', com.google.zxing.client.result.ZXingQR$10);
    com.google.zxing.client.result.CalendarParsedResult.registerClass('com.google.zxing.client.result.CalendarParsedResult', com.google.zxing.client.result.ParsedResult);
    com.google.zxing.client.result.EmailAddressParsedResult.registerClass('com.google.zxing.client.result.EmailAddressParsedResult', com.google.zxing.client.result.ParsedResult);
    com.google.zxing.client.result.ZXingQR$13.registerClass('com.google.zxing.client.result.ZXingQR$13', com.google.zxing.client.result.ResultParser);
    com.google.zxing.client.result.ZXingQR$22.registerClass('com.google.zxing.client.result.ZXingQR$22', com.google.zxing.client.result.ZXingQR$10);
    com.google.zxing.client.result.GeoParsedResult.registerClass('com.google.zxing.client.result.GeoParsedResult', com.google.zxing.client.result.ParsedResult);
    com.google.zxing.client.result.ZXingQR$12.registerClass('com.google.zxing.client.result.ZXingQR$12', com.google.zxing.client.result.ResultParser);
    com.google.zxing.client.result.ISBNParsedResult.registerClass('com.google.zxing.client.result.ISBNParsedResult', com.google.zxing.client.result.ParsedResult);
    com.google.zxing.client.result.ISBNResultParser.registerClass('com.google.zxing.client.result.ISBNResultParser', com.google.zxing.client.result.ResultParser);
    com.google.zxing.client.result.ParsedResultType.registerClass('com.google.zxing.client.result.ParsedResultType');
    com.google.zxing.client.result.ProductParsedResult.registerClass('com.google.zxing.client.result.ProductParsedResult', com.google.zxing.client.result.ParsedResult);
    com.google.zxing.client.result.ZXingQR$C.registerClass('com.google.zxing.client.result.ZXingQR$C', com.google.zxing.client.result.ResultParser);
    com.google.zxing.client.result.ZXingQR$B.registerClass('com.google.zxing.client.result.ZXingQR$B', com.google.zxing.client.result.ResultParser);
    com.google.zxing.client.result.SMSParsedResult.registerClass('com.google.zxing.client.result.SMSParsedResult', com.google.zxing.client.result.ParsedResult);
    com.google.zxing.client.result.TelParsedResult.registerClass('com.google.zxing.client.result.TelParsedResult', com.google.zxing.client.result.ParsedResult);
    com.google.zxing.client.result.ZXingQR$F.registerClass('com.google.zxing.client.result.ZXingQR$F', com.google.zxing.client.result.ResultParser);
    com.google.zxing.client.result.TextParsedResult.registerClass('com.google.zxing.client.result.TextParsedResult', com.google.zxing.client.result.ParsedResult);
    com.google.zxing.client.result.URIParsedResult.registerClass('com.google.zxing.client.result.URIParsedResult', com.google.zxing.client.result.ParsedResult);
    com.google.zxing.client.result.ZXingQR$D.registerClass('com.google.zxing.client.result.ZXingQR$D', com.google.zxing.client.result.ResultParser);
    com.google.zxing.client.result.ZXingQR$A.registerClass('com.google.zxing.client.result.ZXingQR$A');
    com.google.zxing.client.result.ZXingQR$E.registerClass('com.google.zxing.client.result.ZXingQR$E', com.google.zxing.client.result.ResultParser);
    com.google.zxing.client.result.ZXingQR$1D.registerClass('com.google.zxing.client.result.ZXingQR$1D', com.google.zxing.client.result.ResultParser);
    com.google.zxing.client.result.optional.ZXingQR$1C.registerClass('com.google.zxing.client.result.optional.ZXingQR$1C', com.google.zxing.client.result.ResultParser);
    com.google.zxing.client.result.optional.ZXingQR$9.registerClass('com.google.zxing.client.result.optional.ZXingQR$9');
    com.google.zxing.client.result.optional.NDEFSmartPosterParsedResult.registerClass('com.google.zxing.client.result.optional.NDEFSmartPosterParsedResult', com.google.zxing.client.result.ParsedResult);
    com.google.zxing.client.result.optional.ZXingQR$23.registerClass('com.google.zxing.client.result.optional.ZXingQR$23', com.google.zxing.client.result.optional.ZXingQR$1C);
    com.google.zxing.client.result.optional.ZXingQR$24.registerClass('com.google.zxing.client.result.optional.ZXingQR$24', com.google.zxing.client.result.optional.ZXingQR$1C);
    com.google.zxing.client.result.optional.ZXingQR$21.registerClass('com.google.zxing.client.result.optional.ZXingQR$21', com.google.zxing.client.result.optional.ZXingQR$1C);
    com.google.zxing.common.BitArray.registerClass('com.google.zxing.common.BitArray');
    com.google.zxing.common.BitMatrix.registerClass('com.google.zxing.common.BitMatrix');
    com.google.zxing.common.BitSource.registerClass('com.google.zxing.common.BitSource');
    com.google.zxing.common.ByteArray.registerClass('com.google.zxing.common.ByteArray');
    com.google.zxing.common.ByteMatrix.registerClass('com.google.zxing.common.ByteMatrix');
    com.google.zxing.common.ECI.registerClass('com.google.zxing.common.ECI');
    com.google.zxing.common.CharacterSetECI.registerClass('com.google.zxing.common.CharacterSetECI', com.google.zxing.common.ECI);
    com.google.zxing.common.Collections.registerClass('com.google.zxing.common.Collections');
    com.google.zxing.common.DecoderResult.registerClass('com.google.zxing.common.DecoderResult');
    com.google.zxing.common.GridSampler.registerClass('com.google.zxing.common.GridSampler');
    com.google.zxing.common.DefaultGridSampler.registerClass('com.google.zxing.common.DefaultGridSampler', com.google.zxing.common.GridSampler);
    com.google.zxing.common.DetectorResult.registerClass('com.google.zxing.common.DetectorResult');
    com.google.zxing.Binarizer.registerClass('com.google.zxing.Binarizer');
    com.google.zxing.common.GlobalHistogramBinarizer.registerClass('com.google.zxing.common.GlobalHistogramBinarizer', com.google.zxing.Binarizer);
    com.google.zxing.common.HybridBinarizer.registerClass('com.google.zxing.common.HybridBinarizer', com.google.zxing.common.GlobalHistogramBinarizer);
    com.google.zxing.common.PerspectiveTransform.registerClass('com.google.zxing.common.PerspectiveTransform');
    com.google.zxing.common.detector.MonochromeRectangleDetector.registerClass('com.google.zxing.common.detector.MonochromeRectangleDetector');
    com.google.zxing.common.reedsolomon.GF256.registerClass('com.google.zxing.common.reedsolomon.GF256');
    com.google.zxing.common.reedsolomon.ZXingQR$5.registerClass('com.google.zxing.common.reedsolomon.ZXingQR$5');
    com.google.zxing.common.reedsolomon.ReedSolomonDecoder.registerClass('com.google.zxing.common.reedsolomon.ReedSolomonDecoder');
    com.google.zxing.common.reedsolomon.ReedSolomonEncoder.registerClass('com.google.zxing.common.reedsolomon.ReedSolomonEncoder');
    com.google.zxing.oned.OneDReader.registerClass('com.google.zxing.oned.OneDReader', null, com.google.zxing.Reader);
    com.google.zxing.oned.UPCEANReader.registerClass('com.google.zxing.oned.UPCEANReader', com.google.zxing.oned.OneDReader);
    com.google.zxing.oned.UPCEReader.registerClass('com.google.zxing.oned.UPCEReader', com.google.zxing.oned.UPCEANReader);
    com.google.zxing.qrcode.decoder.ZXingQR$7.registerClass('com.google.zxing.qrcode.decoder.ZXingQR$7');
    com.google.zxing.qrcode.decoder.ZXingQR$8.registerClass('com.google.zxing.qrcode.decoder.ZXingQR$8');
    com.google.zxing.qrcode.decoder.ZXingQR$6.registerClass('com.google.zxing.qrcode.decoder.ZXingQR$6');
    com.google.zxing.qrcode.decoder.ZXingQR$14.registerClass('com.google.zxing.qrcode.decoder.ZXingQR$14', com.google.zxing.qrcode.decoder.ZXingQR$6);
    com.google.zxing.qrcode.decoder.ZXingQR$15.registerClass('com.google.zxing.qrcode.decoder.ZXingQR$15', com.google.zxing.qrcode.decoder.ZXingQR$6);
    com.google.zxing.qrcode.decoder.ZXingQR$17.registerClass('com.google.zxing.qrcode.decoder.ZXingQR$17', com.google.zxing.qrcode.decoder.ZXingQR$6);
    com.google.zxing.qrcode.decoder.ZXingQR$1A.registerClass('com.google.zxing.qrcode.decoder.ZXingQR$1A', com.google.zxing.qrcode.decoder.ZXingQR$6);
    com.google.zxing.qrcode.decoder.ZXingQR$1B.registerClass('com.google.zxing.qrcode.decoder.ZXingQR$1B', com.google.zxing.qrcode.decoder.ZXingQR$6);
    com.google.zxing.qrcode.decoder.ZXingQR$18.registerClass('com.google.zxing.qrcode.decoder.ZXingQR$18', com.google.zxing.qrcode.decoder.ZXingQR$6);
    com.google.zxing.qrcode.decoder.ZXingQR$19.registerClass('com.google.zxing.qrcode.decoder.ZXingQR$19', com.google.zxing.qrcode.decoder.ZXingQR$6);
    com.google.zxing.qrcode.decoder.ZXingQR$16.registerClass('com.google.zxing.qrcode.decoder.ZXingQR$16', com.google.zxing.qrcode.decoder.ZXingQR$6);
    com.google.zxing.qrcode.decoder.ZXingQR$4.registerClass('com.google.zxing.qrcode.decoder.ZXingQR$4');
    com.google.zxing.qrcode.decoder.Decoder.registerClass('com.google.zxing.qrcode.decoder.Decoder');
    com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.registerClass('com.google.zxing.qrcode.decoder.ErrorCorrectionLevel');
    com.google.zxing.qrcode.decoder.ZXingQR$3.registerClass('com.google.zxing.qrcode.decoder.ZXingQR$3');
    com.google.zxing.qrcode.decoder.Mode.registerClass('com.google.zxing.qrcode.decoder.Mode');
    com.google.zxing.qrcode.decoder.Version.registerClass('com.google.zxing.qrcode.decoder.Version');
    com.google.zxing.qrcode.decoder.ECBlocks.registerClass('com.google.zxing.qrcode.decoder.ECBlocks');
    com.google.zxing.qrcode.decoder.ECB.registerClass('com.google.zxing.qrcode.decoder.ECB');
    com.google.zxing.ResultPoint.registerClass('com.google.zxing.ResultPoint');
    com.google.zxing.qrcode.detector.AlignmentPattern.registerClass('com.google.zxing.qrcode.detector.AlignmentPattern', com.google.zxing.ResultPoint);
    com.google.zxing.qrcode.detector.ZXingQR$2.registerClass('com.google.zxing.qrcode.detector.ZXingQR$2');
    com.google.zxing.qrcode.detector.Detector.registerClass('com.google.zxing.qrcode.detector.Detector');
    com.google.zxing.qrcode.detector.FinderPattern.registerClass('com.google.zxing.qrcode.detector.FinderPattern', com.google.zxing.ResultPoint);
    com.google.zxing.qrcode.detector.FinderPatternFinder.registerClass('com.google.zxing.qrcode.detector.FinderPatternFinder');
    com.google.zxing.qrcode.detector.ZXingQR$0.registerClass('com.google.zxing.qrcode.detector.ZXingQR$0', null, com.google.zxing.common.Comparator);
    com.google.zxing.qrcode.detector.FinderPatternInfo.registerClass('com.google.zxing.qrcode.detector.FinderPatternInfo');
    com.google.zxing.qrcode.encoder.BitVector.registerClass('com.google.zxing.qrcode.encoder.BitVector');
    com.google.zxing.qrcode.encoder.ZXingQR$1.registerClass('com.google.zxing.qrcode.encoder.ZXingQR$1');
    com.google.zxing.qrcode.encoder.Encoder.registerClass('com.google.zxing.qrcode.encoder.Encoder');
    com.google.zxing.qrcode.encoder.MaskUtil.registerClass('com.google.zxing.qrcode.encoder.MaskUtil');
    com.google.zxing.qrcode.encoder.MatrixUtil.registerClass('com.google.zxing.qrcode.encoder.MatrixUtil');
    com.google.zxing.qrcode.encoder.QRCode.registerClass('com.google.zxing.qrcode.encoder.QRCode');
    com.google.zxing.qrcode.QRCodeReader.registerClass('com.google.zxing.qrcode.QRCodeReader', null, com.google.zxing.Reader);
    com.google.zxing.qrcode.QRCodeWriter.registerClass('com.google.zxing.qrcode.QRCodeWriter', null, com.google.zxing.Writer);
    com.google.zxing.Result.registerClass('com.google.zxing.Result');
    com.google.zxing.ResultMetadataType.registerClass('com.google.zxing.ResultMetadataType');
    com.google.zxing.BarcodeFormat.registerClass('com.google.zxing.BarcodeFormat');
    com.google.zxing.BinaryBitmap.registerClass('com.google.zxing.BinaryBitmap');
    com.google.zxing.DecodeHintType.registerClass('com.google.zxing.DecodeHintType');
    com.google.zxing.EncodeHintType.registerClass('com.google.zxing.EncodeHintType');
    SystemExtend.ArrayExtend.registerClass('SystemExtend.ArrayExtend');
    SystemExtend.CharExtend.registerClass('SystemExtend.CharExtend');
    SystemExtend.Int32Extend.registerClass('SystemExtend.Int32Extend');
    SystemExtend.SingleExtend.registerClass('SystemExtend.SingleExtend');
    SystemExtend.StringExtend.registerClass('SystemExtend.StringExtend');
    SystemExtend.Drawing.Bitmap.registerClass('SystemExtend.Drawing.Bitmap');
    SystemExtend.Drawing.Color.registerClass('SystemExtend.Drawing.Color');
    SystemExtend.Drawing.Rectangle.registerClass('SystemExtend.Drawing.Rectangle');
    SystemExtend.Drawing.Imaging.BitmapData.registerClass('SystemExtend.Drawing.Imaging.BitmapData');
    SystemExtend.Text.Encoding.registerClass('SystemExtend.Text.Encoding');
    com.google.zxing.client.result.ZXingQR$22.$A = ['@', '.', '!', '#', '$', '%', '&', "'", '*', '+', '-', '/', '=', '?', '^', '_', '`', '{', '|', '}', '~'];
    com.google.zxing.client.result.ParsedResultType.ADDRESSBOOK = new com.google.zxing.client.result.ParsedResultType('ADDRESSBOOK');
    com.google.zxing.client.result.ParsedResultType.emaiL_ADDRESS = new com.google.zxing.client.result.ParsedResultType('EMAIL_ADDRESS');
    com.google.zxing.client.result.ParsedResultType.PRODUCT = new com.google.zxing.client.result.ParsedResultType('PRODUCT');
    com.google.zxing.client.result.ParsedResultType.URI = new com.google.zxing.client.result.ParsedResultType('URI');
    com.google.zxing.client.result.ParsedResultType.TEXT = new com.google.zxing.client.result.ParsedResultType('TEXT');
    com.google.zxing.client.result.ParsedResultType.androiD_INTENT = new com.google.zxing.client.result.ParsedResultType('ANDROID_INTENT');
    com.google.zxing.client.result.ParsedResultType.GEO = new com.google.zxing.client.result.ParsedResultType('GEO');
    com.google.zxing.client.result.ParsedResultType.TEL = new com.google.zxing.client.result.ParsedResultType('TEL');
    com.google.zxing.client.result.ParsedResultType.SMS = new com.google.zxing.client.result.ParsedResultType('SMS');
    com.google.zxing.client.result.ParsedResultType.CALENDAR = new com.google.zxing.client.result.ParsedResultType('CALENDAR');
    com.google.zxing.client.result.ParsedResultType.ndeF_SMART_POSTER = new com.google.zxing.client.result.ParsedResultType('NDEF_SMART_POSTER');
    com.google.zxing.client.result.ParsedResultType.mobiletaG_RICH_WEB = new com.google.zxing.client.result.ParsedResultType('MOBILETAG_RICH_WEB');
    com.google.zxing.client.result.ParsedResultType.ISBN = new com.google.zxing.client.result.ParsedResultType('ISBN');
    com.google.zxing.client.result.optional.ZXingQR$9.$7 = 'T';
    com.google.zxing.client.result.optional.ZXingQR$9.$8 = 'U';
    com.google.zxing.client.result.optional.ZXingQR$9.$9 = 'Sp';
    com.google.zxing.client.result.optional.ZXingQR$9.$A = 'act';
    com.google.zxing.client.result.optional.NDEFSmartPosterParsedResult.actioN_UNSPECIFIED = -1;
    com.google.zxing.client.result.optional.NDEFSmartPosterParsedResult.actioN_DO = 0;
    com.google.zxing.client.result.optional.NDEFSmartPosterParsedResult.actioN_SAVE = 1;
    com.google.zxing.client.result.optional.NDEFSmartPosterParsedResult.actioN_OPEN = 2;
    com.google.zxing.client.result.optional.ZXingQR$21.$9 = [null, 'http://www.', 'https://www.', 'http://', 'https://', 'tel:', 'mailto:', 'ftp://anonymous:anonymous@', 'ftp://ftp.', 'ftps://', 'sftp://', 'smb://', 'nfs://', 'ftp://', 'dav://', 'news:', 'telnet://', 'imap:', 'rtsp://', 'urn:', 'pop:', 'sip:', 'sips:', 'tftp:', 'btspp://', 'btl2cap://', 'btgoep://', 'tcpobex://', 'irdaobex://', 'file://', 'urn:epc:id:', 'urn:epc:tag:', 'urn:epc:pat:', 'urn:epc:raw:', 'urn:epc:', 'urn:nfc:'];
    com.google.zxing.common.CharacterSetECI.$1 = null;
    com.google.zxing.common.CharacterSetECI.$2 = null;
    com.google.zxing.common.GlobalHistogramBinarizer.$2 = 8 - 5;
    com.google.zxing.common.GlobalHistogramBinarizer.$3 = 1 << 5;
    com.google.zxing.common.GridSampler.$0 = new com.google.zxing.common.DefaultGridSampler();
    com.google.zxing.common.reedsolomon.GF256.qR_CODE_FIELD = new com.google.zxing.common.reedsolomon.GF256(285);
    com.google.zxing.common.reedsolomon.GF256.datA_MATRIX_FIELD = new com.google.zxing.common.reedsolomon.GF256(301);
    com.google.zxing.oned.OneDReader.$1 = 1 << 8;
    com.google.zxing.oned.UPCEANReader.$6 = Math.floor(com.google.zxing.oned.OneDReader.$1 * 0.42);
    com.google.zxing.oned.UPCEANReader.$7 = Math.floor(com.google.zxing.oned.OneDReader.$1 * 0.7);
    com.google.zxing.oned.UPCEANReader.$8 = [1, 1, 1];
    com.google.zxing.oned.UPCEANReader.$9 = [1, 1, 1, 1, 1];
    com.google.zxing.oned.UPCEANReader.$A = [
        [3, 2, 1, 1],
        [2, 2, 2, 1],
        [2, 1, 2, 2],
        [1, 4, 1, 1],
        [1, 1, 3, 2],
        [1, 2, 3, 1],
        [1, 1, 1, 4],
        [1, 3, 1, 2],
        [1, 2, 1, 3],
        [3, 1, 1, 2]
    ];
    com.google.zxing.oned.UPCEANReader.$B = null;
    (function() {
        com.google.zxing.oned.UPCEANReader.$B = new Array(20);
        for (var $0 = 0; $0 < 10; $0++) {
            com.google.zxing.oned.UPCEANReader.$B[$0] = com.google.zxing.oned.UPCEANReader.$A[$0];
        }
        for (var $1 = 10; $1 < 20; $1++) {
            var $2 = com.google.zxing.oned.UPCEANReader.$A[$1 - 10];
            var $3 = new Array($2.length);
            for (var $4 = 0; $4 < $2.length; $4++) {
                $3[$4] = $2[$2.length - $4 - 1];
            }
            com.google.zxing.oned.UPCEANReader.$B[$1] = $3;
        }
    })();
    com.google.zxing.oned.UPCEReader.$11 = [1, 1, 1, 1, 1, 1];
    com.google.zxing.oned.UPCEReader.$12 = [
        [56, 52, 50, 49, 44, 38, 35, 42, 41, 37],
        [7, 11, 13, 14, 19, 25, 28, 21, 22, 26]
    ];
    com.google.zxing.qrcode.decoder.ZXingQR$6.$0 = [new com.google.zxing.qrcode.decoder.ZXingQR$14(), new com.google.zxing.qrcode.decoder.ZXingQR$15(), new com.google.zxing.qrcode.decoder.ZXingQR$17(), new com.google.zxing.qrcode.decoder.ZXingQR$1A(), new com.google.zxing.qrcode.decoder.ZXingQR$1B(), new com.google.zxing.qrcode.decoder.ZXingQR$18(), new com.google.zxing.qrcode.decoder.ZXingQR$19(), new com.google.zxing.qrcode.decoder.ZXingQR$16()];
    com.google.zxing.qrcode.decoder.ZXingQR$4.$0 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ', '$', '%', '*', '+', '-', '.', '/', ':'];
    com.google.zxing.qrcode.decoder.ZXingQR$4.$3 = false;
    (function() {
        com.google.zxing.qrcode.decoder.ZXingQR$4.$3 = false;
    })();
    com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.l = new com.google.zxing.qrcode.decoder.ErrorCorrectionLevel(0, 1, 'L');
    com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.m = new com.google.zxing.qrcode.decoder.ErrorCorrectionLevel(1, 0, 'M');
    com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.q = new com.google.zxing.qrcode.decoder.ErrorCorrectionLevel(2, 3, 'Q');
    com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.h = new com.google.zxing.qrcode.decoder.ErrorCorrectionLevel(3, 2, 'H');
    com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.$0 = [com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.m, com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.l, com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.h, com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.q];
    com.google.zxing.qrcode.decoder.ZXingQR$3.$3 = [
        [21522, 0],
        [20773, 1],
        [24188, 2],
        [23371, 3],
        [17913, 4],
        [16590, 5],
        [20375, 6],
        [19104, 7],
        [30660, 8],
        [29427, 9],
        [32170, 10],
        [30877, 11],
        [26159, 12],
        [25368, 13],
        [27713, 14],
        [26998, 15],
        [5769, 16],
        [5054, 17],
        [7399, 18],
        [6608, 19],
        [1890, 20],
        [597, 21],
        [3340, 22],
        [2107, 23],
        [13663, 24],
        [12392, 25],
        [16177, 26],
        [14854, 27],
        [9396, 28],
        [8579, 29],
        [11994, 30],
        [11245, 31]
    ];
    com.google.zxing.qrcode.decoder.ZXingQR$3.$4 = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4];
    com.google.zxing.qrcode.decoder.Mode.TERMINATOR = new com.google.zxing.qrcode.decoder.Mode([0, 0, 0], 0, 'TERMINATOR');
    com.google.zxing.qrcode.decoder.Mode.NUMERIC = new com.google.zxing.qrcode.decoder.Mode([10, 12, 14], 1, 'NUMERIC');
    com.google.zxing.qrcode.decoder.Mode.ALPHANUMERIC = new com.google.zxing.qrcode.decoder.Mode([9, 11, 13], 2, 'ALPHANUMERIC');
    com.google.zxing.qrcode.decoder.Mode.structureD_APPEND = new com.google.zxing.qrcode.decoder.Mode([0, 0, 0], 3, 'STRUCTURED_APPEND');
    com.google.zxing.qrcode.decoder.Mode.BYTE = new com.google.zxing.qrcode.decoder.Mode([8, 16, 16], 4, 'BYTE');
    com.google.zxing.qrcode.decoder.Mode.ECI = new com.google.zxing.qrcode.decoder.Mode(null, 7, 'ECI');
    com.google.zxing.qrcode.decoder.Mode.KANJI = new com.google.zxing.qrcode.decoder.Mode([8, 10, 12], 8, 'KANJI');
    com.google.zxing.qrcode.decoder.Mode.fnC1_FIRST_POSITION = new com.google.zxing.qrcode.decoder.Mode(null, 5, 'FNC1_FIRST_POSITION');
    com.google.zxing.qrcode.decoder.Mode.fnC1_SECOND_POSITION = new com.google.zxing.qrcode.decoder.Mode(null, 9, 'FNC1_SECOND_POSITION');
    com.google.zxing.qrcode.decoder.Version.$0 = [31892, 34236, 39577, 42195, 48118, 51042, 55367, 58893, 63784, 68472, 70749, 76311, 79154, 84390, 87683, 92361, 96236, 102084, 102881, 110507, 110734, 117786, 119615, 126325, 127568, 133589, 136944, 141498, 145311, 150283, 152622, 158308, 161089, 167017];
    com.google.zxing.qrcode.decoder.Version.$1 = com.google.zxing.qrcode.decoder.Version.$8();
    com.google.zxing.qrcode.detector.FinderPatternFinder.miN_SKIP = 3;
    com.google.zxing.qrcode.detector.FinderPatternFinder.maX_MODULES = 57;
    com.google.zxing.qrcode.encoder.Encoder.$0 = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 36, -1, -1, -1, 37, 38, -1, -1, -1, -1, 39, 40, -1, 41, 42, 43, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 44, -1, -1, -1, -1, -1, -1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, -1, -1, -1, -1, -1];
    com.google.zxing.qrcode.encoder.MatrixUtil.$0 = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
    ];
    com.google.zxing.qrcode.encoder.MatrixUtil.$1 = [
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    com.google.zxing.qrcode.encoder.MatrixUtil.$2 = [
        [0],
        [0],
        [0],
        [0],
        [0],
        [0],
        [0]
    ];
    com.google.zxing.qrcode.encoder.MatrixUtil.$3 = [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
    ];
    com.google.zxing.qrcode.encoder.MatrixUtil.$4 = [
        [-1, -1, -1, -1, -1, -1, -1],
        [6, 18, -1, -1, -1, -1, -1],
        [6, 22, -1, -1, -1, -1, -1],
        [6, 26, -1, -1, -1, -1, -1],
        [6, 30, -1, -1, -1, -1, -1],
        [6, 34, -1, -1, -1, -1, -1],
        [6, 22, 38, -1, -1, -1, -1],
        [6, 24, 42, -1, -1, -1, -1],
        [6, 26, 46, -1, -1, -1, -1],
        [6, 28, 50, -1, -1, -1, -1],
        [6, 30, 54, -1, -1, -1, -1],
        [6, 32, 58, -1, -1, -1, -1],
        [6, 34, 62, -1, -1, -1, -1],
        [6, 26, 46, 66, -1, -1, -1],
        [6, 26, 48, 70, -1, -1, -1],
        [6, 26, 50, 74, -1, -1, -1],
        [6, 30, 54, 78, -1, -1, -1],
        [6, 30, 56, 82, -1, -1, -1],
        [6, 30, 58, 86, -1, -1, -1],
        [6, 34, 62, 90, -1, -1, -1],
        [6, 28, 50, 72, 94, -1, -1],
        [6, 26, 50, 74, 98, -1, -1],
        [6, 30, 54, 78, 102, -1, -1],
        [6, 28, 54, 80, 106, -1, -1],
        [6, 32, 58, 84, 110, -1, -1],
        [6, 30, 58, 86, 114, -1, -1],
        [6, 34, 62, 90, 118, -1, -1],
        [6, 26, 50, 74, 98, 122, -1],
        [6, 30, 54, 78, 102, 126, -1],
        [6, 26, 52, 78, 104, 130, -1],
        [6, 30, 56, 82, 108, 134, -1],
        [6, 34, 60, 86, 112, 138, -1],
        [6, 30, 58, 86, 114, 142, -1],
        [6, 34, 62, 90, 118, 146, -1],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
    ];
    com.google.zxing.qrcode.encoder.MatrixUtil.$5 = [
        [8, 0],
        [8, 1],
        [8, 2],
        [8, 3],
        [8, 4],
        [8, 5],
        [8, 7],
        [8, 8],
        [7, 8],
        [5, 8],
        [4, 8],
        [3, 8],
        [2, 8],
        [1, 8],
        [0, 8]
    ];
    com.google.zxing.qrcode.encoder.QRCode.nuM_MASK_PATTERNS = 8;
    com.google.zxing.qrcode.QRCodeReader.$0 = new Array(0);
    com.google.zxing.ResultMetadataType.OTHER = new com.google.zxing.ResultMetadataType();
    com.google.zxing.ResultMetadataType.ORIENTATION = new com.google.zxing.ResultMetadataType();
    com.google.zxing.ResultMetadataType.bytE_SEGMENTS = new com.google.zxing.ResultMetadataType();
    com.google.zxing.ResultMetadataType.erroR_CORRECTION_LEVEL = new com.google.zxing.ResultMetadataType();
    com.google.zxing.BarcodeFormat.$0 = {};
    com.google.zxing.BarcodeFormat.qR_CODE = new com.google.zxing.BarcodeFormat('QR_CODE');
    com.google.zxing.BarcodeFormat.DATAMATRIX = new com.google.zxing.BarcodeFormat('DATAMATRIX');
    com.google.zxing.BarcodeFormat.upC_E = new com.google.zxing.BarcodeFormat('UPC_E');
    com.google.zxing.BarcodeFormat.upC_A = new com.google.zxing.BarcodeFormat('UPC_A');
    com.google.zxing.BarcodeFormat.eaN_8 = new com.google.zxing.BarcodeFormat('EAN_8');
    com.google.zxing.BarcodeFormat.eaN_13 = new com.google.zxing.BarcodeFormat('EAN_13');
    com.google.zxing.BarcodeFormat.codE_128 = new com.google.zxing.BarcodeFormat('CODE_128');
    com.google.zxing.BarcodeFormat.codE_39 = new com.google.zxing.BarcodeFormat('CODE_39');
    com.google.zxing.BarcodeFormat.ITF = new com.google.zxing.BarcodeFormat('ITF');
    com.google.zxing.BarcodeFormat.pdF417 = new com.google.zxing.BarcodeFormat('PDF417');
    com.google.zxing.DecodeHintType.OTHER = new com.google.zxing.DecodeHintType();
    com.google.zxing.DecodeHintType.purE_BARCODE = new com.google.zxing.DecodeHintType();
    com.google.zxing.DecodeHintType.possiblE_FORMATS = new com.google.zxing.DecodeHintType();
    com.google.zxing.DecodeHintType.trY_HARDER = new com.google.zxing.DecodeHintType();
    com.google.zxing.DecodeHintType.alloweD_LENGTHS = new com.google.zxing.DecodeHintType();
    com.google.zxing.DecodeHintType.assumE_CODE_39_CHECK_DIGIT = new com.google.zxing.DecodeHintType();
    com.google.zxing.DecodeHintType.neeD_RESULT_POINT_CALLBACK = new com.google.zxing.DecodeHintType();
    com.google.zxing.EncodeHintType.erroR_CORRECTION = new com.google.zxing.EncodeHintType();
    com.google.zxing.EncodeHintType.characteR_SET = new com.google.zxing.EncodeHintType();
    SystemExtend.Int32Extend.maxValue = Number.MAX_VALUE;
    SystemExtend.SingleExtend.naN = Number.NaN;
})(); // This script was generated using Script# v0.7.4.0
