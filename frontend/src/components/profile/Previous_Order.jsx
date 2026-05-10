import React, { useEffect, useState } from 'react';
import privateAxios from '../../api/privateAxios';
import Order_Card from './Order_Card';
import { Loader2 } from 'lucide-react';

const Previous_Order = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await privateAxios.get('/task/user');
      setOrders(res.data.tasks || []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className='rounded-2xl shadow-xl transition-all border border-blur-[14px] bg-[rgba(20,22,35,0.55)] border-white/20 p-5 lg:w-[67rem]'>
      <h2 className='text-highlight font-bold text-xl'>Orders History</h2>
      {isLoading ? (
        <div className="flex justify-center mt-5"><Loader2 className="animate-spin text-highlight" /></div>
      ) : (
        <div className='mt-5 flex gap-3 lg:gap-5 overflow-x-auto pb-4 custom-scroll'>
          {orders.length > 0 ? (
            orders.map(order => <Order_Card key={order._id} order={order} onReviewSubmitted={fetchOrders} />)
          ) : (
            <p className="text-gray-400">No previous orders found.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Previous_Order;