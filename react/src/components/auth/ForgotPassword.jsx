import { FormControl, FormHelperText, FormLabel, Link, useDisclosure } from '@chakra-ui/react'
import { sendPasswordResetEmail } from 'firebase/auth'
import React, { useState } from 'react'
import { useAuth } from 'reactfire'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    Button,
    Input,
    Alert,
    AlertIcon,
    AlertDescription,
  } from '@chakra-ui/react'

const ForgotPassword = () => {
    
    const auth = useAuth()
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleResetPassword = async () => {
        await sendPasswordResetEmail(auth, email)
        setSent(true)
    }   
  
    return (
    <>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalBody m={2}>
                {!sent &&
                    <FormControl>
                        <FormLabel>Please enter your email:</FormLabel>
                            <Input 
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                    </FormControl>}
                {sent &&
                    <Alert status='info'>
                        <AlertIcon />
                        <AlertDescription>Please check your email!</AlertDescription>
                    </Alert>
                }
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
                </Button>
                {!sent &&
                    <Button variant='ghost' onClick={handleResetPassword}>Reset Password</Button>}
            </ModalFooter>
            </ModalContent>
        </Modal>
        <FormHelperText>
            <Link onClick={onOpen}>Reset Password</Link>
        </FormHelperText>
    </>
  )
}

export default ForgotPassword