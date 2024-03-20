import {Link} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import {Table, Button} from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {useGetUserCodeQuery} from '../slices/userCodeApiSlice';

const UserCodePage = () => {
    const {data:usercode, isLoading, error } = useGetUserCodeQuery();
    const sortUserCode = usercode ? usercode.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
    //console.log(sortUserCode);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString(); 
    };
  return (
    <>
     <Link className='btn btn-light my-3' variant='outline-danger' to='/'>
        Go Back
     </Link>
     <div className='text-center'>
         <h1>Submission Details</h1>
     </div>
     
     {isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :(
        <Table striped hover responsive className='table-sm'>
        <thead>
            <tr>
                <th>UserName</th>
                <th>CodeLanguage</th>
                <th>Stdin</th>
                <th>SourceCode</th>
                <th>Stdoutput</th>
                <th>TimeStamp</th>
            </tr>
        </thead>
        <tbody>
            {sortUserCode.map((code)=>(
                <tr key={code.id}>
                    <td>{code.username}</td>
                    <td>{code.codelanguage}</td>
                    <td>{code.stdin}</td>
                    <td>{code.sourcecode.substring(0, 100)}</td>
                    <td>{code.output}</td>
                    <td>{formatTimestamp(code.createdAt)}</td>
                    <LinkContainer to={`/usercode/${code.id}`}>
                    <Button  variant='outline-danger'>
                        Details
                    </Button>
                     </LinkContainer>
                </tr>
            ))}
        </tbody>
     </Table>
     )}
    </>
  )
}

export default UserCodePage
