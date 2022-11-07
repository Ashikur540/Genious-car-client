import React, { useContext } from 'react';
import { useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthProvider/AuthProvider';

const Checkout = () => {
    const { title, price, _id } = useLoaderData().data;
    const { user } = useContext(AuthContext);
    // console.log(title, price);
    const handlePlaceOrder = e => {
        e.preventDefault();
        const form = e.target;
        const allValues = {
            fullname: `${form.firstName.value} ${form.lastName.value}`,
            email: user?.email || `unregistered`,
            phone: form.phone.value,
            message: form.message.value

        }
        console.log(allValues);

        const orderInfo = {
            service_id: _id,
            serviceName: title,
            customer_fullName: allValues.fullname,
            email: allValues.email,
            phone: allValues.phone,
            message: allValues.message,
            price: price

        }
        console.log(orderInfo);

        // note down => get , post e kokhon ki ki pathassi 
        // must write content type properly
        fetch('https://y-fawn.vercel.app/orders', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(orderInfo),
        })
            .then(res => res.json())
            .then(data => {
                if (data.successMsg) {
                    console.log(data.data);
                    toast.success(data.successMsg);
                    form.reset();
                }
                else {
                    toast.error(data.errorMsg)
                }
            })
            .catch(error => toast.error(error.message))

    }

    return (
        <div>
            <form onSubmit={handlePlaceOrder}>
                <h2 className="text-4xl">You are about to order: {title}</h2>
                <h4 className="text-3xl">Price: {price}</h4>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <input name="firstName" type="text" placeholder="First Name" className="input input-ghost w-full  input-bordered" />
                    <input name="lastName" type="text" placeholder="Last Name" className="input input-ghost w-full  input-bordered" />
                    <input name="phone" type="text" placeholder="Your Phone" className="input input-ghost w-full  input-bordered" required />
                    <input name="email" type="text" placeholder="Your email" defaultValue={user?.email} className="input input-ghost w-full  input-bordered" readOnly />
                </div>
                <textarea name="message" className="textarea textarea-bordered h-24 w-full" placeholder="Your Message" required></textarea>

                <input className='btn' type="submit" value="Place Your Order" />
            </form>
        </div>
    );
};

export default Checkout;