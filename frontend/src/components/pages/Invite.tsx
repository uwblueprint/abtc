import React, { useEffect, useState } from "react";
import {
    Text,
    Flex,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Checkbox,
    Badge,
    IconButton,
    Icon,
} from '@chakra-ui/react';
import { FaCheck, FaXmark, FaSistrix, FaArrowsRotate, FaBars, FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { useLocation } from 'react-router-dom'

import NavBarAdmin from "../common/NavBarAdmin";
import ServiceRequestAPIClient from "../../APIClients/ServiceRequestAPIClient";
import NavBarVolunteer from "../common/NavBarVolunteer";

interface UserInfo {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
    createdAt: string | null;
}

const Invite = (): React.ReactElement => {

    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const [userInfo, setUserInfo] = useState<UserInfo[]>([]);

    useEffect(() => {
        console.log(id)
        const fetchData = async () => {
            try {
                const response = await ServiceRequestAPIClient.getPlatformSignups();
                setUserInfo(response);
            } catch (error) {
                console.error("Error fetching platform signups:", error);
            }
        };
        fetchData();
    }, []);

    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 999;

    useEffect(() => {
        setCheckedItems(new Array(userInfo.length).fill(false));
    }, [userInfo]);

    const handleSelectAllChange = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setCheckedItems(new Array(userInfo.length).fill(newSelectAll));
    };

    const handleCheckboxChange = (index: number) => {
        const newCheckedItems = [...checkedItems];
        newCheckedItems[index] = !newCheckedItems[index];
        setCheckedItems(newCheckedItems);
        setSelectAll(newCheckedItems.every(item => item));
    };

    const getBadgeBg = (status: string): string => {
        if (status === "PENDING") return '#DACFFB';
        return 'gray.200';
    };

    const getBadgeColor = (status: string): string => {
        if (status === "PENDING") return "#230282";
        return 'black';
    };

    const handleApproveClick = () => {
        console.log("Approve icon clicked");
    };

    const handleRejectClick = () => {
        console.log("Reject icon clicked");
    };

    const handleSearchClick = () => {
        console.log("Search icon clicked");
    };

    const handleRefreshClick = () => {
        console.log("Refresh icon clicked");
    };

    const handleFilterClick = () => {
        console.log("Filter icon clicked");
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(userInfo.length / itemsPerPage);
    const currentItems = userInfo.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const itemCountStart = (currentPage - 1) * itemsPerPage + 1;
    const itemCountEnd = Math.min(currentPage * itemsPerPage, userInfo.length);

    return (
        <div>
            Invite Page
        </div>
    );
};

export default Invite;