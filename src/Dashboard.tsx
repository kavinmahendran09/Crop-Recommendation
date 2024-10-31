import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { FaChartLine, FaUser, FaClipboardList} from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
    const location = useLocation();
    const result = location.state?.result;

    if (!result) {
        return <div>No data to display</div>;
    }

    const formatIndianNumber = (number: number) => {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }).format(number);
    };

    const comparisonData = [
        { crop: result.best_crop, yield: result.best_yield_per_hectare },
        { crop: 'Wheat', yield: 25 }, 
        { crop: 'Rice', yield: 20 },  

    ];

    const chartData = {
        labels: comparisonData.map(item => item.crop),
        datasets: [
            {
                label: 'Estimated Yield per Hectare (Quintals)',
                data: comparisonData.map(item => item.yield),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Crop Yield Comparison',
            },
        },
    };

    return (
        <div>
            <Navbar />
            <Container fluid>
                <Row>
                    <Col md={2} className="bg-dark text-white vh-100 p-3">
                        <ListGroup variant="flush">
                            <ListGroup.Item className="bg-dark text-white border-0">
                                <FaChartLine className="me-2" /> Dashboard
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-white border-0">
                                <FaUser className="me-2" /> Account
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-dark text-white border-0">
                                <FaClipboardList className="me-2" /> Weather
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>

                    <Col md={10} className="mt-3">
                        <h2 className="mb-4">Dashboard</h2>
                        <Row className="g-4">
                            <Col md={3}>
                                <Card className="text-center">
                                    <Card.Body>
                                        <Card.Title className="h4">
                                            <i className="bi bi-plant-fill"></i>
                                            Best Crop to Grow
                                        </Card.Title>
                                        <Card.Text className="h6">
                                            {result.best_crop}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={3}>
                                <Card className="text-center">
                                    <Card.Body>
                                        <Card.Title className="h4">
                                            <i className="bi bi-graph-up-arrow"></i>
                                            Estimated Yield
                                        </Card.Title>
                                        <Card.Text className="h6">
                                            {formatIndianNumber(result.best_yield_per_hectare)} quintals/hectare
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={3}>
                                <Card className="text-center">
                                    <Card.Body>
                                        <Card.Title className="h4">
                                            <i className="bi bi-cash-stack"></i> 
                                            Price per Quintal
                                        </Card.Title>
                                        <Card.Text className="h6">
                                            ₹{formatIndianNumber(result.price_per_quintal)}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={3}>
                                <Card className="text-center bg-success text-white">
                                    <Card.Body>
                                        <Card.Title className="h4">
                                            <i className="bi bi-currency-rupee"></i> 
                                            Estimated Revenue
                                        </Card.Title>
                                        <Card.Text className="h6">
                                            ₹{result.total_revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Row className="mt-4">
                            <Col md={12}>
                                <Card>
                                    <Card.Body>
                                        <Bar data={chartData} options={options} />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Dashboard;
