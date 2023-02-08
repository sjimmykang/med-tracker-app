import { Link } from 'react-router-dom'


const ErrorPage = () => {
    return (
        <div>
            <h1>404! Error. page does not exist</h1>

            <Link to={`/`}>
                <h2>Back</h2>
            </Link>
        </div>
    )
}


export default ErrorPage;