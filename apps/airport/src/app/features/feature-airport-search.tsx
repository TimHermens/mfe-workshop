import { AirportTable } from '../ui/airport-table';
import React, { useContext, useState } from 'react';
import { AirportDomainContext } from '../domain/application/airport-domain-context';
import { Airport } from '../domain/entities/airport';
import { useSearchAirportsFacade } from '../domain/application/search-airports.facade';

interface Props {
  onEditClicked: (airport: Airport) => void;
}

export function FeatureAirportSearch(props: Props) {
  const [name, setName] = useState('');
  const { airports } = useContext(AirportDomainContext);
  const { findAirports } = useSearchAirportsFacade();

  async function onSearchClicked(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    await findAirports(name);
  }

  return (
    <>
      <div className="card">
        <div className="header">
          <h2 className="title">Airport Search</h2>
        </div>
        <div className="content">
          <form>
            <div className="form-group">
              <label>Name:</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                name="name"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <button
                onClick={(e) => onSearchClicked(e)}
                className="btn btn-default"
              >
                Search
              </button>

              {airports.length > 0 && (
                <div>{airports.length} airports found!</div>
              )}
            </div>
          </form>
        </div>
      </div>

      <AirportTable airports={airports} onEditClicked={props.onEditClicked} />
    </>
  );
}
