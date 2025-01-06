'use strict';

var client = require('@prisma/client');
var axios = require('axios');
var express = require('express');
var dotnet = require('dotenv');
var jwt = require('jsonwebtoken');
var zod = require('zod');
var bcrypt = require('bcrypt');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var axios__default = /*#__PURE__*/_interopDefault(axios);
var express__default = /*#__PURE__*/_interopDefault(express);
var dotnet__default = /*#__PURE__*/_interopDefault(dotnet);
var jwt__namespace = /*#__PURE__*/_interopNamespace(jwt);

var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/features/Middleware/errors.ts
var errormiddleware = (error, req, res, next) => {
  error.status || 500;
  error.message || "Internal Server Error";
  res.status(error.status).json({
    message: error.message,
    errorCode: error.errorCode || "UNKNOWN_ERROR",
    errors: error.errors || null
  });
};
dotnet__default.default.config({ path: ".env" });
var Port = process.env.PORT;
var JWT_SECRET = process.env.JWT_SECRET;

// src/features/Exception/root.ts
var HttpException = class extends Error {
  status;
  message;
  errorCode;
  errors;
  constructor(status, message, errorCode, errors) {
    super(message);
    this.status = status;
    this.message = message;
    this.errorCode = errorCode;
    this.errors = errors;
  }
};

// src/features/Exception/unauthorized.ts
var UnauthorizedException = class extends HttpException {
  constructor(message, errorCode, errors) {
    super(401, message, errorCode, errors);
  }
};

// src/features/Middleware/authMiddleware.ts
var AuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    next(
      new UnauthorizedException("Token not found", 4001 /* TOKEN_NOT_FOUND */)
    );
  }
  try {
    const payload = jwt__namespace.verify(token, JWT_SECRET);
    const prisma2 = new client.PrismaClient();
    const user = await prisma2.user.findFirst({
      where: { id: payload.userId }
    });
    if (!user) {
      next(
        new UnauthorizedException("Invalid Token", 4001 /* TOKEN_NOT_FOUND */)
      );
    }
    req.user = user;
    next();
  } catch (err) {
    next(
      new UnauthorizedException("Invalid Token", 4001 /* TOKEN_NOT_FOUND */)
    );
  }
};

// src/features/auth/login-authentication/controller.ts
var loginAuthentication = async (req, res) => {
  res.json(req.user);
};

// src/features/auth/login-authentication/routes.ts
var loginAuth = express.Router();
loginAuth.get("/me", [AuthMiddleware], loginAuthentication);
var routes_default = loginAuth;

// src/features/Exception/bad-request.ts
var BadRequest = class extends HttpException {
  constructor(message, errorCode) {
    super(400, message, errorCode, null);
  }
};

// src/error-handler.ts
var ErrorHandler = (method) => {
  return async (req, res, next) => {
    try {
      await method(req, res, next);
    } catch (err) {
      let exception = HttpException;
      if (err instanceof HttpException) {
        exception = err;
      } else if (err instanceof zod.ZodError) {
        exception = new BadRequest(
          "Unprocessed Entity , missing or Json error",
          1004 /* UNPROCESSABLE_ENTITY */
        );
      } else {
        exception = new HttpException(
          500,
          "Internal server error",
          5001 /* INTERNAL_SERVER_ERROR */,
          err?.issues
        );
      }
      next(exception);
    }
  };
};

// src/features/Exception/notfound-exception.ts
var NotFoundException = class extends HttpException {
  constructor(message, errorCode) {
    super(404, message, errorCode, null);
  }
};
var SignUpSchema = zod.z.object({
  name: zod.z.string().min(3).max(16),
  email: zod.z.string().email("Invalid email"),
  password: zod.z.string().min(6, "Password must be at least 6 characters")
});
var loginController = async (req, res) => {
  SignUpSchema.parse(req.body);
  const { email, password, name } = req.body;
  if (!email || !password) {
    throw new BadRequest(
      "Email and password are required",
      3001 /* BAD_REQUEST */
    );
  }
  const user = await prisma.user.findFirst({
    where: { email }
  });
  if (!user) {
    throw new NotFoundException("User not found", 1001 /* USER_NOT_FOUND */);
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequest("Invalid password", 1003 /* INVALID_PASSWORD */);
  }
  const token = jwt__namespace.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "1h"
  });
  res.status(200).json({
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  });
};

// src/features/auth/login/routes.ts
var loginRouter = express.Router();
loginRouter.post("/login", ErrorHandler(loginController));
var routes_default2 = loginRouter;
var Signup = async (req, res) => {
  SignUpSchema.parse(req.body);
  const { email, password, name } = req.body;
  const user = await prisma.user.findFirst({
    where: { email }
  });
  if (user) {
    throw new BadRequest("User already exists", 1002 /* USER_ALREADY_EXISTS */);
  }
  const Userdata = await prisma.user.create({
    data: {
      email,
      password: bcrypt.hashSync(password, 10),
      name
    }
  });
  return res.send(Userdata);
};

// src/features/auth/signup/routes.ts
var signupRouter = express.Router();
signupRouter.post("/signup", ErrorHandler(Signup));
var routes_default3 = signupRouter;

// src/features/Middleware/adminMiddleware.ts
var AdminMiddleware = (req, res, next) => {
  const user = req.user;
  if (user.role === "ADMIN") {
    next();
  } else {
    next(new UnauthorizedException("UNAUTHORIZED", 4001 /* TOKEN_NOT_FOUND */));
  }
};

// src/features/products/CreateProduct/controller.ts
var getProducts = async (req, res) => {
  req.body;
  const createProducts = await prisma.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(",")
    }
  });
  res.status(200).json({
    message: "Login successful",
    user: req.user.name,
    product: {
      id: createProducts.id,
      name: createProducts.name,
      description: createProducts.description,
      price: createProducts.price,
      tags: createProducts.tags
    }
  });
};

// src/features/products/CreateProduct/router.ts
var CreateProductRouter = express.Router();
CreateProductRouter.post(
  "/createproduct",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(getProducts)
);
var router_default = CreateProductRouter;

// src/features/products/DeleteProduct/controller.ts
var DeleteProduct = async (req, res) => {
  try {
    const product = req.body;
    const deleteProduct = await prisma.product.delete({
      where: { id: +req.params.id }
      //+ means number type
    });
    res.json({
      ...deleteProduct,
      message: "Product deleted sucessfully"
    });
  } catch (err) {
    throw new NotFoundException("Product not found", 1001 /* USER_NOT_FOUND */);
  }
};

// src/features/products/DeleteProduct/router.ts
var DeleteProductRouter = express.Router();
DeleteProductRouter.delete(
  "/:id",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(DeleteProduct)
);
var router_default2 = DeleteProductRouter;
var GetProductById = async (req, res) => {
  try {
    const product = req.body;
    const prisma2 = new client.PrismaClient();
    const getproduct = await prisma2.product.findFirst({
      where: { id: Number(req.params.id) }
    });
    res.json({
      ...product,
      getproduct
    });
  } catch (err) {
    throw new NotFoundException(
      "Some error while finding list By Id",
      1001 /* USER_NOT_FOUND */
    );
  }
};

// src/features/products/GetProductById/router.ts
var GetProductByIdRouter = express.Router();
GetProductByIdRouter.get(
  "/:id",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(GetProductById)
);
var router_default3 = GetProductByIdRouter;
var ListProduct = async (req, res) => {
  try {
    const prisma2 = new client.PrismaClient();
    const count = await prisma2.product.count();
    const products = await prisma2.product.findMany({
      skip: +req.params.skip || 0,
      take: 5
    });
    res.json({
      count,
      data: products
    });
  } catch (err) {
    throw new NotFoundException(
      "Some error while finding list",
      1001 /* USER_NOT_FOUND */
    );
  }
};

// src/features/products/ListProduct/router.ts
var ListProductRouter = express.Router();
ListProductRouter.get(
  "/",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(ListProduct)
);
var router_default4 = ListProductRouter;
var UpdateProduct = async (req, res) => {
  try {
    const product = req.body;
    if (product.tags) {
      product.tags = product.tags.join(",");
    }
    const prisma2 = new client.PrismaClient();
    const updateproduct = await prisma2.product.update({
      where: { id: Number(req.params.id) },
      data: product
    });
    res.json(updateproduct);
  } catch (error) {
    throw new NotFoundException("Product not found", 1001 /* USER_NOT_FOUND */);
  }
};

// src/features/products/UpdateProduct/router.ts
var UpdateProductRouter = express.Router();
UpdateProductRouter.put(
  "/:id",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(UpdateProduct)
);
var router_default5 = UpdateProductRouter;

// src/features/routes.ts
var mainRouter = express.Router();
mainRouter.use("/auth", routes_default2);
mainRouter.use("/auth", routes_default3);
mainRouter.use("/auth", routes_default);
mainRouter.use("/products", router_default);
mainRouter.use("/products", router_default2);
mainRouter.use("/products", router_default3);
mainRouter.use("/products", router_default4);
mainRouter.use("/products", router_default5);
var routes_default4 = mainRouter;

// src/index.ts
var app = express__default.default();
var cors = __require("cors");
app.use(cors());
app.use(axios__default.default);
app.use(express__default.default.json());
var prisma = new client.PrismaClient();
app.use("/api", routes_default4);
app.use(errormiddleware);
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
  console.log("CTR + C to exit");
});

exports.prisma = prisma;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map