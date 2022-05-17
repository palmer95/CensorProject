import './App.css';
import FileUpload from './components/FileUpload';
//Created by John Palmer 
const App = () => {

  return (
    <div className="container mt-5">
    <h4 className="display-4 text-center mb-4">
      ReDoc
    </h4>
    <p className="display-6 text-center mb-4">
      A Document Censoring Tool
    </p>
    <FileUpload />

  </div>
  )
}

export default App;
