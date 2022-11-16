import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import UserWithRoles from "../../items/user/UserWithRoles";
import Pagination from "../../pagination/Pagination";
import SearchBarPeople from "../../searchBar/SearchBarPeople";
import "./ManageUsersRoles.css";

const PEOPLE_URL = "/api/users";
const ROLES_URL = "/api/roles";

const PageSize = 60;

const ManageUserRoles = () => {
    const axiosPrivate = useAxiosPrivate();

    const [roles, setRoles] = useState();
    const [users, setUsers] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(null);
    const [totalPageCount, setTotalPageCount] = useState(null);

    const handleSearchChange = useCallback((searchVal) => {
        let isMounted = true;
        const controller = new AbortController();
        const getUsersWithSearch = async () => {

            let searchQuery;
            if(!searchVal){
                searchQuery = '';
            }else{
                searchQuery = "?searchValue=" + searchVal;
            }

            try {
                const response = await axiosPrivate.get(PEOPLE_URL  + searchQuery, {
                    signal: controller.signal
                });

                isMounted && setUsers(response.data.users);
                isMounted && setTotalCount(response.data.totalItems);
                isMounted && setTotalPageCount(response.data.totalPages);
                isMounted && setCurrentPage(1);
            } catch (error) {
                console.error(error);
            }
        };

        getUsersWithSearch();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

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
            <SearchBarPeople handleSearchChange={handleSearchChange}/>
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