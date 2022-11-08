import { useEffect } from 'react';
import { useEditAirportsFacade } from '../domain/application/edit-airports.facade';

interface Props {
  id: number;
}

export function FeatureAirportEdit(props: Props) {
  const { airport, findAirport } = useEditAirportsFacade();

  useEffect(() => {
    findAirport(props.id);
  }, []);

  return (
    <div className="card">
      <div className="header">
        <h1 className="title">Airport Edit</h1>
      </div>

      <div className="content">
        <p>Id: {airport?.id}</p>
        <p>Name: {airport?.name}</p>
      </div>
    </div>
  );
}
