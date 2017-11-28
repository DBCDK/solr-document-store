const React = require("react");
const ReactDOM = require("react-dom");
import SolrDocstoreGUI from './components/solr-docstore-gui';
// Webpack will bundle styling
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

ReactDOM.render(
    <SolrDocstoreGUI/>,
    document.getElementById('solr-docstore-gui-root')
);
