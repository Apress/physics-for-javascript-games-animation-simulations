﻿var vec1 = new Vector2D(1, 1);
var vec2 = new Vector2D(1, 0);
console.log(vec1.length()); // magnitude of vec1
console.log(vec1.lengthSquared()); // magnitude squared of vec1
console.log((Vector2D.angleBetween(vec1, vec2) * 180) / Math.PI); // static method that returns the angle between two vectors
console.log(vec1.dotProduct(vec2)); // returns dot product of vec1 with vec2
