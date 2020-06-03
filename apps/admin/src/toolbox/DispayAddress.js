import * as React from 'react';
import pure from 'recompose/pure';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import get from 'lodash/get';

const AddressField = ({
    className,
    record = {},
    streetAddress,
    postalCode,
    addressLocality,
    addressCountry,
    ...rest
}) => {
    const street = get(record, streetAddress);
    const postal = get(record, postalCode);
    const locality = get(record, addressLocality);
    const country = get(record, addressCountry);

    return (
        <Typography
            component="span"
            variant="body2"
            className={className}
            {...rest}
        >
            {street} <br />
            {postal} {locality} {country}
        </Typography>
    );
};

AddressField.propTypes = {
    className: PropTypes.string.isRequired,
    addressCountry: PropTypes.string,
    addressLocality: PropTypes.string,
    postalCode: PropTypes.string,
    streetAddress: PropTypes.string,
    record: PropTypes.object,
};

// wat? TypeScript looses the displayName if we don't set it explicitly
AddressField.displayName = 'AddressField';

const EnhancedAddressField = pure(AddressField);

EnhancedAddressField.defaultProps = {
    addLabel: true,
};

EnhancedAddressField.propTypes = {
    ...Typography.propTypes,
};

EnhancedAddressField.displayName = 'EnhancedAddressField';

export default EnhancedAddressField;
