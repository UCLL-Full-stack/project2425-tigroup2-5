import subscription from "@/app/pages/subscription/page";
import { Subscription } from "../../../../types";

type Props = {
    subscription: Array<Subscription>;

}
import Header from "../header";

const SubscriptionOverview: React.FC<Props> = ({subscription}) => {
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
                                    {subscription.map((subscription: Subscription) => (
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