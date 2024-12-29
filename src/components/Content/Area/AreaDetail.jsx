import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTablesByAreaId } from "../../../services/TableService";
import Table from "./Table";
import { getAllArea } from "../../../services/AreaService";

function AreaDetail(){
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    // get areaId from url
    const {areaId: paramAreaId} = useParams();
    const [areaId, setAreaId] = useState(null);

    useEffect(() => {       
        setAreaId(paramAreaId);
    }, [paramAreaId]);

    useEffect(() => {
        fetchTables();
    }, [areaId]);

    const fetchTables = async() => {
        try {
            setLoading(true);
            const response = await getTablesByAreaId(areaId);
            setTables(response.data.result);
        } catch (error) {
            console.log('Error fetching tables: ', error)
        }
        finally{
            setLoading(false);
        }
    };

    

    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => {
                return <Table tableId={table.tableId} name={table.tableName} status={table.status}/>
            })}
        </div>
    );
};

export default AreaDetail;