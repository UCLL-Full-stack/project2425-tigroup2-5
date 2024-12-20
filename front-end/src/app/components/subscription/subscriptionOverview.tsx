import { Subscription } from "../../../../types";
import Header from "../header";

type Props = {
    subscriptions: Array<Subscription>;
};


const SubscriptionOverview: React.FC<Props> = ({subscriptions}) => {
    return (
        <div>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-black">My Subscriptions</h1>
                <div className="subscription-list">
                    <div className="col-md-12">
                        <table className="table table-striped">
                                <thead className="text-black">
                                    <tr>
                                        <th>ID</th>
                                        <th>Type</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody className="text-black">
                                    {subscriptions.map((subscription: Subscription) => (
                                        <tr key={subscription.id}>
                                            <td>{subscription.id}</td>
                                            <td>{subscription.type}</td>
                                            <td>{subscription.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                </div>
            </div>
        </div>
    );
    }

export default SubscriptionOverview;