import React, {useEffect, useState} from "react";
import {Button, Modal, Checkbox, Item} from "semantic-ui-react";
import useCookie from 'react-use-cookie';
import { useNavigate } from "react-router-dom";

//Todo: allow passing variable to the function, needed for reopening the modal
//Todo: if privacy policy is declined, user should only be able to access /privacy
const PrivacyPolicy = () => {
    //set state on basis of cookie state
    const [privacyCookie, setPrivacyCookie] = useCookie('privacyPolicyAccepted')
    const [open, setOpen] = useState(!(privacyCookie === 'true'))
    const [checkboxChecked, setCheckboxChecked] = useState<boolean|undefined>(false)
    const navigate = useNavigate();
    
    //console.log('privacy cookie is defined', privacyCookie === undefined)
    console.log('state of cookie', privacyCookie)
    //console.log ('privacy cookie is true', privacyCookie === 'true')
    //Todo: modal should be always open if there's no cookie consent given ("" or null)
    //Todo: modal should be closed if either option is pressed
    //Todo: if policy is rejected user should be thrown to privacy jail
    //Todo: if policy is accepted, it should be stored to a cookie/session/localstorage
    //      and modal window should be closed

    useEffect( () => {
        setOpen(!(privacyCookie === 'true'));
        console.log('useEffect hook', open)
    }, [privacyCookie, open])

    return (
        <Modal
            open={open}
        >
            <Modal.Content>
                <h1>Privacy policy</h1>
                <p>We respect your privacy and your control over your own data. Please read our Privacy policy and give your consent to it. In our Privacy policy we explain what kind of personal data we collect from the users of the platform. We also explain how Talko uses cookies to ensure the best browsing experience and to collect information about the use of the platform.</p>
                <p>You must also be at least 18 years of age to use our service.</p>
                <p><Item href="/talko_privacy.pdf" download>Download privacy policy</Item> </p>
                <Checkbox label='I am at least 18 years of age and I consent to the privacy policy. '
                    onChange={(e,data) => setCheckboxChecked(data.checked)}/>
                <p></p>
                <Button
                    onClick={(() => {
                        console.log('accepted')
                        setPrivacyCookie('true')
                        setOpen(false)
                    }
                    
                    )} disabled={!checkboxChecked}>Consent</Button>
                <Button
                    onClick={(() => {
                        console.log('declined')
                        setPrivacyCookie('false')
                        //navigate("/privacy")
                        setOpen(false)
                    })}
                >Reject</Button>
            </Modal.Content>
            
        </Modal>
    )
}
export default PrivacyPolicy