function arrumarUnico(array) {
    let s = "";
    let props = [];

    let args = array
        .splice(1, array.length)
        .map((v, i) => `'${v}'`)
        .join(", ");

    for (let _a of array[0]) {
        props.push(_a);
    }

    props.sort();

    let comentados = [];

    for (let p of props) {
        if (comentados.indexOf(`${p}`) === -1) {
            s += `\t\t\t//${p}\n`;
            comentados.push(p);
        }
        s += `['${p}', ${args}],\n`;
    }

    s = bubbleSort(`[${s}]`);

    return s.substring(1, s.length - 1);
}

function arrumarMultiplo(array) {
    let s = "";
    let resultado = "";

    for (let _a of array) {
        s += arrumarUnico(_a);
    }

    s = s.slice(0, -1);

    s = bubbleSort(eval(`[${s}]`));

    let comentados = [];

    for (let _array of s) {
        let atributo = _array[0];
        let args = _array
            .slice(1, _array.length)
            .map(v => {
                if (/.+ => \d+/.test(v)) {
                    let m = v.match(/(.+) => \d+/)[1];
                    return v.replace(m, `\'${m}\'`);
                } else if (/.+ => .+/.test(v)) {
                    let [, m1, m2] = v.match(/(.+) => (.+)/);
                    v = v.replace(m1, `${m1}\'`);
                    v = v.replace(m2, `\'${m2}`);
                }

                return `'${v}'`;
            })
            .join(", ");
        if (comentados.indexOf(`${atributo}`) === -1) {
            resultado += `\t\t\t//${atributo}\n`;
            comentados.push(atributo);
        }
        resultado += `['${atributo}', ${args}],\n`;
    }

    return resultado;
}

function pushSubstring(start, final, array, str) {
    array.push(str.substring(start, final));
}

function converter() {
    let str = $("#converter").val();
    if (str.endsWith(",")) str = str.slice(0, -1);
    str = str.trim().replace(/\s+/g, ' ').split('');

    let bracketGroups = [], found = false, index = 0, nestedBrackets = 0;

    for (let [i, v] of str.entries()) {
        if (v === '[') {
            if (found) {
                nestedBrackets++;
            } else {
                found = true;
                index = i;
            }
        } else if (v === ']') {
            if (nestedBrackets) {
                nestedBrackets--;
            } else {
                pushSubstring(index, i, bracketGroups, str);
                found = false;
            }
        }
    }

    str = str.join('');

    for (let _str of bracketGroups) {
        let _n_str;

        let virgulas = [], index = 1, parentheses = 0, brackets = -1;

        for (let [i, v] of _str.split('').entries()) {
            (v === '(' && parentheses++) || (v === '[' && brackets++);
            (v === ')' && parentheses--) || (v === ']' && brackets--);

            if (v === ',' && !parentheses && !brackets) {
                pushSubstring(index, i, virgulas, _str);
                index = i + 1;
            } else if (i === _str.length - 1) {
                pushSubstring(index, _str.length - 1, virgulas, _str);
            }
        }

        virgulas.forEach((v, i) => {
            if (/=>/.test(v)) {
                v = v.replace(/(['"])/g, '\\$1');
                let match = v.match(/((['"]).+\2) =>/)[1];

                v = v.replace(match, match.slice(0, -1))+ '\'';
                str.replace(_str, v);
            }
        });

        /*
        if (/(['"]).+\1 => \d+/.test(_str)) {
            _n_str = _str;
            let m = _n_str.match(/(['"]).+\1/)[0];
            _n_str = _str.replace(m, m.slice(0, -1));
            m = _n_str.match(/=> \d+\b/)[0];
            _n_str = _n_str.replace(m, `${m}'`);
            str = str.replace(_str, _n_str);
        } else if (/(['"]).+\1 => (['"]).+\2/.test(_str)) {
            _n_str = _str.split('').reverse();
            let p = false;
            let qnt = 2;
            for (let [i, v] of _n_str.entries()) {
                if ([`'`, `"`].indexOf(v) !== -1) {
                    if (p && qnt) {
                        delete _n_str[i];
                        qnt--;
                    } else {
                        p = true;
                    }
                }
            }
            _n_str = _n_str.reverse().join('');
            str = str.replace(_str, _n_str);
        }
        */

    }


    /*if ($("#tipo").val() == 0) {
      $("#convertido").val(arrumarUnico(eval(str)));
    } else {*/
    $("#convertido").val(arrumarMultiplo(eval(`[${str}]`)));
    // }
}

$("#converter").keyup(converter);

// $("#tipo").change(converter);

function bubbleSort(array) {
    let len = array.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1; j++) {
            if (array[j][0] > array[j + 1][0]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                // let tmp = array[j];
                // array[j] = array[j + 1];
                // array[j + 1] = tmp;
            }
        }
    }
    return array;
}
