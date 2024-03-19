import {Link} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import {Table, Button} from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {useGetUserCodeQuery} from '../slices/userCodeApiSlice';

const UserCodePage = () => {
    const {data:usercode, isLoading, error } = useGetUserCodeQuery();
    console.log(usercode);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString(); 
    };
  return (
    <>
     <Link className='btn btn-light my-3' to='/'>
        Go Back
     </Link>
     <h1>Submission Details</h1>
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
            {usercode.map((code)=>(
                <tr key={code.id}>
                    <td>{code.username}</td>
                    <td>{code.codelanguage}</td>
                    <td>{code.stdin}</td>
                    <td>{code.sourcecode.substring(0, 100)}</td>
                    <td>{code.output}</td>
                    <td>{formatTimestamp(code.createdAt)}</td>
                    <LinkContainer to={`/usercode/${code.id}`}>
                    <Button className='btn-sm' variant='light'>
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
