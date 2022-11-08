import { FeatureAirportEdit } from '../../../features/feature-airport-edit';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../ui/breadcrumb';

export function PageAirportEdit() {
  const { id } = useParams();

  return (
    <>
      <Breadcrumb />
      <FeatureAirportEdit id={Number(id)} />
    </>
  );
}
