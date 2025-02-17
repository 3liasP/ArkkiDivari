import React, { Component } from 'react';
import Error from './error';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        // You can also log the error to an error reporting service
    }

    render() {
        if (this.state.hasError) {
            return (
                <Error
                    error={this.state.error}
                    errorInfo={this.state.errorInfo}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
