import { Employment } from "@/../types";

type Props = {
    employments: Array<Employment>;
};

const EmploymentOverview: React.FC<Props> = ({employments}) => {

    return (
        <>

        {employments && (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <table className="table table-striped">
                                <thead className="text-black">
                                    <tr>
                                        <th>ID</th>
                                        <th>Employee name</th>
                                        <th>Club</th>
                                    </tr>
                                </thead>
                                <tbody className="text-black">
                                    {employments.map((employment) => (
                                        <tr key={employment.id}>
                                            <td>{employment.id}</td>
                                            <td>{employment.employee?.person?.firstname}</td>
                                            <td>{employment.club?.address}</td>
                                        </tr>
                                    ))}
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

export default EmploymentOverview;