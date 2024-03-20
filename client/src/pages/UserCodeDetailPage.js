import {useParams,Link} from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {Row, Col,ListGroup} from 'react-bootstrap';
import {Editor} from '@monaco-editor/react';
import {useGetSingleUserCodeQuery} from '../slices/userCodeApiSlice';


const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(); 
};
const UserCodeDetailPage = () => {

  const {id:userID} = useParams();

  const {data: usercode, isLoading, error} = useGetSingleUserCodeQuery(userID);
  //console.log(usercode);

  return isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
    <>
        <div className='text-center'>
           <h1>{usercode.username} Submission</h1>
        </div>
        
        <Row>
          <Col md={4}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Details</h2>
                <p>
                  <strong>Name: </strong>{usercode.username}
                </p>
                <p>
                  <strong>CodeLanguage: </strong>{usercode.codelanguage}
                </p>
                <p>
                  <strong>Std-Input: </strong>{usercode.stdin}
                </p>
                <p>
                  <strong>Time-Of-Submission </strong>{formatTimestamp(usercode.createdAt)}
                </p>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={5}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>SourceCode</h2>
                <Editor
                height='340px'
                language={usercode.codelanguage}
                defaultValue={usercode.sourcecode.replace(/\\n/g, '\n')}
                options={{ readOnly: true }}
              />
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Output-Details</h2>
                <textarea
                rows={10} 
                style={{ width: '100%' }}
                readOnly
                value={usercode.output}
              />
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>   
    </> 
  )
}

export default UserCodeDetailPage
