
import Image from 'next/image';
import LoadingDot from '../icons/LoadingDot';

export default function Loading() {
  console.log('not working')
  return <Image alt="loading" src={ <LoadingDot />} />
}