import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import UserWithRoles from "../../items/user/UserWithRoles";
import Pagination from "../../pagination/Pagination";
import "./ManageUsersRoles.css";

const PEOPLE_URL = "/api/users";
const ROLES_URL = "/api/roles";

const PageSize = 60;

const ManageUserRoles = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [roles, setRoles] = useState();
    const [users, setUsers] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPageCount, setTotalPageCount] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getRoles = async () => {
            try {
                const response = await axiosPrivate.get(ROLES_URL, {
                    signal: controller.signal
                });

                const options = [];
                response.data.map(role => options.push({"value" : role.roleId , "label": role.name}));
                isMounted && setRoles(options);
            } catch (error) {
                console.error(error);
            }
        };

        getRoles();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(PEOPLE_URL + "?page=" + (currentPage - 1), {
                    signal: controller.signal
                });
    
                isMounted && setUsers(response.data.users);
                isMounted && setTotalCount(response.data.totalItems);
                isMounted && setTotalPageCount(response.data.totalPages);
            } catch (error) {
                console.error(error);
            }
        };

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [currentPage]);

    return ( 
        <div className="manageRolesDiv">
            <button onClick={() => navigate(-1)}>Go back</button>
            <ul className="usersToManage">
            {users ? users.map(user => (
                    <li key={user.userId}>
                        <UserWithRoles user={user} allRoles={roles}/>
                    </li>
                )) : null
            }
            </ul>
            <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={totalCount}
                    totalPageCount={totalPageCount}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                />
        </div>
    );
}
 
export default ManageUserRoles;