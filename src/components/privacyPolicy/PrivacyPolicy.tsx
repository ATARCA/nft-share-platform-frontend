import React, {useEffect, useState} from "react";
import {Button, Modal, Checkbox, Item} from "semantic-ui-react";
import useCookie from 'react-use-cookie';

const PrivacyPolicy = () => {
    const [privacyCookie, setPrivacyCookie] = useCookie('privacyPolicyAccepted')
    const [open, setOpen] = useState(!(privacyCookie === 'true'))
    const [checkboxChecked, setCheckboxChecked] = useState<boolean|undefined>(false)
    const [policyRejected, setPolicyRejected] = useState(false);

    useEffect( () => {
        setOpen(!(privacyCookie === 'true'));
    }, [privacyCookie, open])

    return (
        <Modal
            open={open}
        >
            <Modal.Content>
                <h1>Privacy policy</h1>
                <p>We respect your privacy and your control over your own data. Please read our Privacy policy and give your consent to it. In our Privacy policy we explain what kind of personal data we collect from the users of the platform. We also explain how Talko uses cookies to ensure the best browsing experience and to collect information about the use of the platform.</p>
                <p>You must also be at least 18 years of age to use our service.</p>
                <p><Item href="/talko_privacy.pdf" target="_blank">Open the Privacy policy in a separate tab</Item> </p>
                <Checkbox label='I am at least 18 years of age and I consent to the privacy policy. '
                    onChange={(e,data) => {
                        setPolicyRejected(false)
                        setCheckboxChecked(data.checked)
                    }}/>
                <p></p>
                {policyRejected && 
                    <p className="attention-color">Accepting privacy policy is required to use the platform.</p>
                }
                <Button
                    onClick={(() => {
                        console.log('accepted')
                        setPrivacyCookie('true')
                        setOpen(false)
                        setPolicyRejected(false)
                    }
                    
                    )} disabled={!checkboxChecked}>Consent</Button>
                <Button
                    onClick={(() => {
                        console.log('declined')
                        setPrivacyCookie('false')
                        setOpen(false)
                        setPolicyRejected(true)
                        setCheckboxChecked(false)
                    })}
                >Reject</Button>
            </Modal.Content>
        </Modal>
    )
}
export default PrivacyPolicy