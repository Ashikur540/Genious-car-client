import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthProvider/AuthProvider';
import OrderRow from './OrderRow';


const Orders = () => {
    const { user, logoutUser } = useContext(AuthContext)
    const [orders, setOrders] = useState([]);
    const [refresh, setRefresh] = useState(false);

    // HERE WE USEED SET REFRESH TO INSTANT DELETE DATA.. BUT TYOU CAN DO IT BY FILTERING THR REWMINING AND SET THEM IN STATE
    const handleDelete = id => {
        const consent = window.confirm("are you sure to delete?")
        if (consent) {
            fetch(`https://y-fawn.vercel.app/orders/${id}`, {
                method: "delete",
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        console.log(data.data);
                        toast.success(data.message);
                        setRefresh(!refresh)
                        console.log(refresh);
                    }
                    else {
                        toast.error(data.message)
                    }
                })
                .catch(err => toast.error(err))
        }
        else {
            return;
        }
    }

    // exapmple query serach:https://y-fawn.vercel.app/orders?email=tony@gmail.com
    // As we are loading data based on dynamic so it must change as email changes so add dependency
    useEffect(() => {
        fetch(`https://y-fawn.vercel.app/orders?email=${user.email}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    return logoutUser();
                    //    and also remove the token from local storage must
                }
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    console.log("all:", data);
                    console.log(data.data);
                    setOrders(data.data);

                }
                else {
                    toast.error(data.error)
                }

            })
            .catch(error => toast.error(error.message))

    }, [user?.email, refresh])

    // aslo note down all htttp mathods 



    const handleStatusUpdate = id => {

        fetch(`https://y-fawn.vercel.app/orders/${id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ status: "Approved" })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log(data.data);
                    const remain = orders.filter(odr => odr._id !== id);
                    const approving = orders.find(odr => odr._id === id);
                    approving.status = "approved";
                    const newOrders = [approving, ...remain];
                    setOrders(newOrders);
                    toast.success(data.message);
                }
                else {
                    toast.error(data.error)
                }
            })
            .catch(err => toast.error(err))
    }

    return (
        <div>
            <h2 className="text-5xl">You have {orders.length} Orders</h2>
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>
                            </th>
                            <th>Name</th>
                            <th>Job</th>
                            <th>Favorite Color</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map(order => <OrderRow
                                key={order._id}
                                order={order}
                                handleDelete={handleDelete}
                                handleStatusUpdate={handleStatusUpdate}
                            ></OrderRow>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;