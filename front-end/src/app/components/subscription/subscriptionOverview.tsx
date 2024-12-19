import Header from "../header";

const SubscriptionOverview = () => {
    return (
        <div>
            <Header></Header>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-black">My Subscriptions</h1>
                <div className="subscription-list">
                    {/* Render the list of subscriptions here */}
                </div>
            </div>
        </div>
    );
    }

export default SubscriptionOverview;