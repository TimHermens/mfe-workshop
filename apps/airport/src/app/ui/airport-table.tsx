import { Airport } from '../domain/entities/airport';

interface Props {
  airports: Airport[];
  onEditClicked: (airPort: Airport) => void;
}

export function AirportTable(props: Props) {
  return (
    <>
      {props.airports.length > 0 && (
        <div className="card">
          <table className="table table-condensed">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {props.airports.map((airport) => (
                <tr key={airport.id}>
                  <td>
                    <span className="badge badge-pill badge-info">
                      {airport.id}
                    </span>
                  </td>
                  <td>{airport.name}</td>
                  <td>
                    <a
                      onClick={() => props.onEditClicked(airport)}
                      className="btn btn-success btn-sm"
                      style={{ minWidth: '85px' }}
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
            <tbody></tbody>
          </table>
        </div>
      )}
    </>
  );
}
