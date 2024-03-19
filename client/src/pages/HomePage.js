import {useState} from 'react';
import {Button, Row,Col} from'react-bootstrap';
import {Editor} from '@monaco-editor/react';
import {useCreateUserCodeMutation, useRunUserCodeMutation} from '../slices/userCodeApiSlice'
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {Base64} from 'js-base64';

// const languageNames = {
//     '53':'C++',
//     '62':'Java',
//     '63':'JavaScript',
//     '71':'Python'
// };
const languageModes = {
    '53': 'cpp',
    '62': 'java',
    '63': 'javascript',
    '71': 'python'
};
function decode(bytes) {
    return Base64.decode(bytes || "");
}

const HomePage = () => {

    const [username,setUserName] = useState('');
    const [codelanguage,setCodeLanguage] = useState('');
    const [stdin,setStdIn] = useState('');
    const [sourcecode,setSourceCode] = useState('');
    const [output, setOutput] = useState('');

    const [createUserCode] = useCreateUserCodeMutation();
    const [runUserCode] = useRunUserCodeMutation();

    const handleLanguageChange = (e) =>{
        const languageId = e.target.value;
        setCodeLanguage(languageId);
    }

    const runCode =  async(e)=>{
        e.preventDefault();
        try {
            const res = await runUserCode({
                language_id: codelanguage,
                source_code: sourcecode,
                stdin
            }).unwrap();
            const stdout = decode(res.stdout);
            const compile_output = decode(res.compile_output);
            const final_result = [compile_output,stdout].join("\n").trim();
            if(res.status.id === 11){
                const stderr = decode(res.stderr);
                console.log(stderr);
                setOutput(stderr);
            }else{
                setOutput(final_result);
            }   
        } catch (error) {
            console.error(error);
            toast.error('Not Working');
        }
        
    }

    console.log("Final Output:", output);
    const navigate = useNavigate();

    const submitHandler = async(e)=>{
        e.preventDefault();
        try {
            const formattedSourceCode = sourcecode.replace(/\n/g, '\\n');
            if(!username){
                toast.error("UserName field Can't be Empty");
            }
            if(!codelanguage){
                toast.error("CodeLanguage field Can't be Empty");
            }
            if(!sourcecode){
                toast.error("SourceCode field Can't be Empty");
            }
            if(!output){
                toast.error("Output field Can't be Empty");
            }
            const res = await createUserCode({
                username,
                codelanguage: languageModes[codelanguage],
                stdin,
                sourcecode: formattedSourceCode,
                output
            }).unwrap();
            console.log(res);
            toast.success('Code Saved Successfully');
            navigate('/usercode');
        } catch (error) {
            console.error(error);
            toast.error('Not Saved');
        }
    };

  return (
    <>
        <h1>Enter Your Code and Details</h1>
            <Row>
                {/* <Col sm={6}> */}
               <Col md={2}>
               <div className="mb-3">
                   <label htmlFor="username" className="form-label">UserName</label>
                   <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUserName(e.target.value)} />
                </div>
         <div className="mb-3">
            <label htmlFor="codelanguage" className="form-label">Select Language</label>
            <select className="form-select" id="codelanguage" value={codelanguage} onChange={handleLanguageChange}>
              <option value="">Select Language</option>
              <option value="53">Cpp</option>
              <option value="62">Java</option>
              <option value="63">JavaScript</option>
              <option value="71">Python</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="stdin" className="form-label">Enter Input</label>
            <textarea className="form-control" id="stdin" value={stdin} onChange={(e) => setStdIn(e.target.value)} />
          </div>
        </Col>
            <Col md={6} >
            <div className="mb-3">
            <label htmlFor="sourcecode" className="form-label">SourceCode</label>
            <Editor
              height="370px"
              language={languageModes[codelanguage]}
              value={sourcecode}
              onChange={(value, event) => setSourceCode(value)}
            />
          </div>
            </Col>
            {/* <Col sm={6}> */}
                <Col md={4}>
                <div className="mb-3">
            <label htmlFor="output" className="form-label">Output</label>
            <textarea className="form-control" id="output" rows={5} value={output} readOnly />
          </div>
          <Button onClick={runCode} variant="primary" className="mb-3">Run</Button>
          <div className="text-center">
            <Button onClick={submitHandler} variant="primary">Submit</Button>
          </div>
            </Col>
            </Row>
    </> 
  )
}

export default HomePage
