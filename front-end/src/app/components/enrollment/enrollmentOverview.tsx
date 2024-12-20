import Header from "../header";
import { Enrollment } from "@/../types";

type Props = {
  enrollments: Array<Enrollment>;
};

const EnrollmentOverview: React.FC<Props> = ({enrollments}) => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <table className="table table-striped text-center text-black">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">member</th>
                  <th scope="col">club</th>
                  <th scope="col">region</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                    <tr key={enrollment.id}>
                      <td>{enrollment.id}</td>
                      <td>{enrollment.member?.person?.firstname} {enrollment.member?.person?.surname}</td>
                      <td>{enrollment.club?.address}</td>
                      <td>{enrollment.region?.name}</td>
                    </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
</>
  );
}

export default EnrollmentOverview;