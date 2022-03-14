if (!Number.prototype.toFixed || (0.00008).toFixed(3) !== "0.000" ||
    (0.9).toFixed(0) === "0" || (1.255).toFixed(2) !== "1.25" ||
    (1000000000000000128).toFixed(0) !== "1000000000000000128") {
    (function () {
        var base, size, data, i;
        base = 1e7;
        size = 6;
        data = [0, 0, 0, 0, 0, 0];
        function multiply (n, c) {
            var i = -1;
            while (++i < size) {
                c += n * data[i];
                data[i] = c % base;
                c = Math.floor(c / base);
            }
        }

        function divide (n) {
            var i = size, c = 0;
            while (--i >= 0) {
                c += data[i];
                data[i] = Math.floor(c / n);
                c = (c % n) * base;
            }
        }

        function toString () {
            var i = size;
            var s = "";
            while (--i >= 0) {
                if (s !== "" || i === 0 || data[i] !== 0) {
                    var t = String(data[i]);
                    if (s === "") {
                        s = t;
                    } else {
                        s += "0000000".slice(0, 7 - t.length) + t;
                    }
                }
            }
            return s;
        }

        function pow (x, n, acc) {
            return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x)
                : pow(x * x, n / 2, acc)));
        }

        function log (x) {
            var n = 0;
            while (x >= 4096) {
                n += 12;
                x /= 4096;
            }
            while (x >= 2) {
                n += 1;
                x /= 2;
            }
            return n;
        }

        Number.prototype.toFixed = function (fractionDigits) {
            var f, x, s, m, e, z, j, k;
            f = Number(fractionDigits);
            f = f !== f ? 0 : Math.floor(f);

            if (f < 0 || f > 20) {
                throw new RangeError("Number.toFixed called with invalid number of decimals");
            }

            x = Number(this);

            if (x !== x) {
                return "NaN";
            }

            if (x <= -1e21 || x > 1e21) {
                return String(x);
            }

            s = "";

            if (x < 0) {
                s = "-";
                x = -x;
            }

            m = "0";

            if (x > 1e-21) {
                // 1e-21<x<1e21
                // -70<log2(x)<70
                e = log(x * pow(2, 69, 1)) - 69;
                z = (e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1));
                z *= 0x10000000000000;// Math.pow(2,52);
                e = 52 - e;

                // -18<e<122
                // x=z/2^e
                if (e > 0) {
                    multiply(0, z);
                    j = f;

                    while (j >= 7) {
                        multiply(1e7, 0);
                        j -= 7;
                    }

                    multiply(pow(10, j, 1), 0);
                    j = e - 1;

                    while (j >= 23) {
                        divide(1 << 23);
                        j -= 23;
                    }
                    divide(1 << j);
                    multiply(1, 1);
                    divide(2);
                    m = toString();
                } else {
                    multiply(0, z);
                    multiply(1 << (-e), 0);
                    m = toString() + "0.00000000000000000000".slice(2, 2 + f);
                }
            }

            if (f > 0) {
                k = m.length;

                if (k <= f) {
                    m = s + "0.0000000000000000000".slice(0, f - k + 2) + m;
                } else {
                    m = s + m.slice(0, k - f) + "." + m.slice(k - f);
                }
            } else {
                m = s + m;
            }

            return m;
        };

    })();
}
