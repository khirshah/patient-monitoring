const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const getFilesFromDir = require("./config/files");
const PAGE_DIR = path.join("src", "pages", path.sep);

const jsFiles = getFilesFromDir(PAGE_DIR, [".js"]);
const entry = jsFiles.reduce( (obj, filePath) => {
   const entryChunkName = filePath.replace(path.extname(filePath), "").replace(PAGE_DIR, "");
   obj[entryChunkName] = `./${filePath}`;
   return obj;
}, {});

const htmlFiles = getFilesFromDir(PAGE_DIR, [".html"]);
const htmlPlugins = htmlFiles.map( filePath => {
  const fileName = filePath.replace(PAGE_DIR, "");
  return new HtmlWebpackPlugin({
    chunks:[fileName.replace(path.extname(fileName), ""), "vendor"],
    template: filePath,
    filename: fileName,
  })
});

module.exports = {
	mode: 'development',
  entry: entry,
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    ...htmlPlugins,
    new CleanWebpackPlugin(),
     new CopyPlugin([
      { from: 'src/assets', to: 'assets' }
    ])
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
            chunks: "initial",
            name: "vendor",
            enforce: true
        }
      }
    }
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: {
                  localIdentName: "[name]__[local]___[hash:base64:5]",
              },
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader'
        }
      },
      { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'url-loader?limit=100000'}
    ]
  },
  performance: { hints: false }
};