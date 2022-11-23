import "./AppLogs.css";

import { useState, useEffect, useCallback, useRef } from 'react';
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Pagination from "../../pagination/Pagination";

const LOGS_URL = "/api/logs";

const PageSize = 50;

const SearchBarLogs = ({handleSearchChange, msgRef, dateStartRef, dateEndRef}) => {

    return ( 
        <div className="logsSearchBar">
            <input
                className="search_logs_inpt"
                type="text"
                id="search"
                placeholder=" Search..."
                ref={msgRef}
                onChange={() => handleSearchChange()}
            />

            <input
                className="date_start"
                type="datetime-local"
                id="search"
                ref={dateStartRef}
                onChange={() => handleSearchChange()}
            />

            <input
                className="date end"
                type="datetime-local"
                id="search"
                ref={dateEndRef}
                onChange={() => handleSearchChange()}
            />
        </div>
    );
}

const Logs = () => {
    const axiosPrivate = useAxiosPrivate();
    const [logs, setLogs] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPageCount, setTotalPageCount] = useState(null);

    const msgRef = useRef();
    const dateStartRef = useRef();
    const dateEndRef = useRef();

    const handleSearchChange = useCallback(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getLogs = async () => {

            let searchQuery = '?';
            const msg = msgRef.current.value;
            const start = dateStartRef.current.value;
            const end = dateEndRef.current.value;
            if(msg !== ""){
                searchQuery = "msg=" + msg;
            }

            if(start){
                searchQuery = searchQuery + "&start=" + start;
            }

            if(end){
                searchQuery = searchQuery + "&end=" + end;
            }

            try {
                const response = await axiosPrivate.get(LOGS_URL  + searchQuery, {
                    signal: controller.signal
                });

                console.log(response.data);

                isMounted && setLogs(response.data.logDTOs);
                isMounted && setTotalCount(response.data.totalItems);
                isMounted && setTotalPageCount(response.data.totalPages);
                isMounted && setCurrentPage(1);
            } catch (error) {
                console.error(error);
            }
        };

        getLogs();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getLogs = async () => {
            try {
                const response = await axiosPrivate.get(LOGS_URL + "?page=" + (currentPage - 1), {
                    signal: controller.signal
                });

                isMounted && setLogs(response.data.logDTOs);
                isMounted && setTotalCount(response.data.totalItems);
                isMounted && setTotalPageCount(response.data.totalPages);
            } catch (error) {
                console.error(error);
            }
        }

        getLogs();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [currentPage]);

    return (  
        <div className="logsMain">
            <div className="logsMainSubDiv">
            <SearchBarLogs handleSearchChange={handleSearchChange} msgRef={msgRef} dateStartRef={dateStartRef} dateEndRef={dateEndRef} />
            {logs ? <ul className="logsList">
                            {
                                logs.map(log => (
                                    <li className="logInfo" key={log.logId}>
                                        <p>Log message: {log.logMessage}</p>
                                        <p>Log date: {log.date}</p>
                                    </li>
                                    )
                                )
                            }
                       </ul>
                    : null
            }
            <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={totalCount}
                    totalPageCount={totalPageCount}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                />
            </div>
        </div>
    );
}
 
export default Logs;