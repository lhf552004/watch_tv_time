import { Alert, AlertIcon } from "@chakra-ui/react"

const AlertBox = ({
    title = 'You are not authorised to view this resource',
    status = 'warning',
}) => {
  return (
    <Alert status={status}>
        <AlertIcon />
        {title}
    </Alert>
  )
}

export default AlertBox