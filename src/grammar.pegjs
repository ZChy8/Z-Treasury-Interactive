// Simple Arithmetics Grammar
// ==========================
//
// Accepts expressions like "2 * (3 + 4)" and computes their value.

Expression = head:Comparison tail:(_ ("&" / "|" / "AND" / "OR") _ Comparison)* {
	return tail.reduce((result, element) => (o, fields, log) => {
    log(o)
    return ({
      "&": () => !!result(o, fields, log) && !!element[3](o, fields, log),
      "AND": () => !!result(o, fields, log) && !!element[3](o, fields, log),
      "|": () => !!result(o, fields, log) || !!element[3](o, fields, log),
      "OR": () => !!result(o, fields, log) || !!element[3](o, fields, log),
    })[element[1]]();
  }, head);
}

Comparison = head:Value tail:(_ ("<=" / ">=" / ">" / "<" /  "=" / "!=") _ Value)* {
	return tail.reduce((result, element) => (o, fields, log) => {
    log(o)
    return ({
        "<": () => ~~result(o, fields, log) < ~~element[3](o, fields, log),
        ">": () => ~~result(o, fields, log) > ~~element[3](o, fields, log),
        "<=": () => ~~result(o, fields, log) <= ~~element[3](o, fields, log),
        ">=": () => ~~result(o, fields, log) >= ~~element[3](o, fields, log),
        "=": () => result(o, fields, log) == element[3](o, fields, log),
        "!=": () => result(o, fields, log) != element[3](o, fields, log),
    })[element[1]]();
  }, head);
}

Value
  = "(" _ expr:Expression _ ")" { return (o, fields, log) => expr(o, fields, log); }
  / Literal
  / Field

Field = _ f:([a-zA-Z]+) {return (o, fields, log) =>
  {
    log(o, fields, f.join(""), fields.indexOf(f.join("")), o[fields.indexOf(f.join(""))]);
    return o[fields.indexOf(f.join(""))]
  }
}

Literal = Integer / String / Boolean

Integer
  = _ n:([0-9]+) { return () => parseInt(n.join(""), 10); }

Boolean
  = _ b:("true" / "false") {return () => b.join("") === "true"}

String
  = _ "\"" s:([0-9]+) "\"" { return () => s.join("") }

_
  = [ \t\n\r]*
