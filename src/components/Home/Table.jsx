import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';

function Table({name, created, price, status}){
    return(
        <Card>
            <h4>{name}</h4>
            <p>{created}</p>
            <FontAwesomeIcon icon={faUtensils} size="2x" />
            <p>{price}</p>
        </Card>
    );
};

export default Table;