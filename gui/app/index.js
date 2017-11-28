const React = require("react");
const ReactDOM = require("react-dom");
import App from './components/app';
// Webpack will bundle styling
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
