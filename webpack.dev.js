import { merge } from "webpack-merge";
import common from "./webpack.common.js";

export default merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    host: "localhost",
    open: true,
    watchFiles: ["./src/template.html"],
  },
});
