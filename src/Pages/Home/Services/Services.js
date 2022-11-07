import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';
import ServiceCard from './ServiceCard';

const Services = () => {
    const [services, setServices] = useState([]);
    const location = useLocation();
    console.log(location.pathname);




    useEffect(() => {
        fetch('https://y-fawn.vercel.app/services')
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    toast.success(data.message)
                    setServices(data.data)
                }
                else {
                    toast.error(data.error)
                }
            })
            .catch(err => toast.error(err.message))
    }, []);

    return (
        <div>
            <div className='text-center mb-4'>
                <p className="text-2xl font-bold text-orange-600">Services</p>
                <h2 className="text-5xl font-semibold">Our Service Area</h2>
                <p>the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. </p>
            </div>
            <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                {

                    location.pathname === "/services" ?
                        services.map(service => <ServiceCard
                            key={service._id}
                            service={service}
                        ></ServiceCard>)
                        :
                        services.slice(0, 3).map(service => <ServiceCard
                            key={service._id}
                            service={service}
                        ></ServiceCard>)

                }
            </div>
        </div>
    );
};

export default Services;