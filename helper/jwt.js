const { expressjwt: jwt } = require('express-jwt');

function authJwt() {
  const secret = process.env.secret;
  return jwt({
    secret,
    algorithms: ['HS256'],
    // will be revoked if no admin
    isRevoked: isRevoked,
  }).unless({
    //dont forget slash / in the front
    // go to regex101.com to turns normal route to regex
    //   /\/api\/v1\/products/   --->   /api/v1/products
    path: [
      { url: /\/api\/v1\/products/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories/, methods: ['GET', 'OPTIONS'] },
      /\/api\/v1\/users\/login/,
      /\/api\/v1\/users\/register/,
    ],
  });
}

// req = for request
// payload is the data inside the token
//
async function isRevoked(req, jwt) {
  const payload = jwt.payload;

  const restrictedRoutes = [
    '/api/v1/categories/admin',
    '/api/v1/products/admin',
    '/api/v1/orders/admin',
    // Add more patterns as needed
  ];

  if (
    !payload.isAdmin &&
    restrictedRoutes.some((pattern) => req.originalUrl.includes(pattern))
  ) {
    return true;
  }
  return false;
}

module.exports = authJwt;
