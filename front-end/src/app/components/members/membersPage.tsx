import Header from "../header";
import { Member } from "@/../types/";

type Props = {
    members: Array<Member>;
};

const MembersPage: React.FC<Props> = ({members}) => {

    return (
        <>

        {members && (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <table className="table table-striped">
                                <thead className="text-black">
                                    <tr>
                                        <th>ID</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                    </tr>
                                </thead>
                                <tbody className="text-black">
                                    {members.map((member: Member) => (
                                        <tr key={member.id}>
                                            <td>{member.id}</td>
                                            <td>{member.person?.firstname}</td>
                                            <td>{member.person?.surname}</td>
                                            <td>{member.person?.email}</td>
                                            <td>{member.person?.phone}</td>
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

export default MembersPage;