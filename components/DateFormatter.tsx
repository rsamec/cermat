import { parseISO, format as dateFormat } from 'date-fns'

type Props = {
  dateString: string  
  format?:string
}

const DateFormatter = ({ dateString,  format }: Props) => {
  const date = parseISO(dateString); 
  return <time dateTime={dateString}>{dateFormat(date, format ?? 'd, yyyy')}</time>
}

export default DateFormatter