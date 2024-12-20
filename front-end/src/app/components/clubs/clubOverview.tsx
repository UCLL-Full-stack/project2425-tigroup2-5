import { Club } from "@/../types";

type Props = {
    clubs: Array<Club>;
};

const ClubOverview: React.FC<Props> = ({clubs}) => {

    return (
        <>

        {clubs && (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <table className="table table-striped">
                                <thead className="text-black">
                                    <tr>
                                        <th>ID</th>
                                        <th>Address</th>
                                        <th>Region</th>
                                    </tr>
                                </thead>
                                <tbody className="text-black">
                                    {clubs.map((club) => {
                                        return (
                                            <tr key={club.id}>
                                                <td>{club.id}</td>
                                                <td>{club.address}</td>
                                                <td>{club.region?.name}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
        }
        </>
    );
};

export default ClubOverview;