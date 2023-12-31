import React from 'react';
import { Layout, Radio } from 'antd';
import '../css/home.css';
import { BookCarousel } from "../components/BookCarousel";
import { BookList } from "../components/BookList";
import TagSearchBar from "../components/TagSearchBar";
import API_BASE_URL from '../config';

const { Content } = Layout;

class HomeView extends React.Component {
    state = {
        books: [],
        searchMode: 'tag' // 'tag' or 'title'
    };

    componentDidMount() {
        this.fetchBooks();
    }

    fetchBooks = async () => {
        // Fetch all books initially
        const response = await fetch(`${API_BASE_URL}/api/books`);
        const data = await response.json();
        this.setState({ books: data });
    };

    handleTagSearch = async (searchTerm) => {
        if (this.state.searchMode === 'tag') {
            // Existing logic for tag-based search
            const response = await fetch(`${API_BASE_URL}/api/books/searchByTag?tag=${searchTerm}`);
            const data = await response.json();
            this.setState({ books: data });
        } else {
            // Fetch books based on title using GraphQL
            const graphqlQuery = {
                query: `query searchBooks($title: String!) { searchBooksByTitle(title: $title) { id, title, author, description, type, price, imageUrl, quantity }}`,
                variables: { title: searchTerm }
            };
    
            const response = await fetch(`${API_BASE_URL}/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(graphqlQuery),
            });
    
            const responseData = await response.json();
            this.setState({ books: responseData.data.searchBooksByTitle });
        }
    };
    
    

    handleSearchModeChange = (e) => {
        this.setState({ searchMode: e.target.value });
    };

    render() {
        return (
            <Layout className="layout">
                <Content style={{ padding: '0 50px' }}>
                    <Radio.Group value={this.state.searchMode} onChange={this.handleSearchModeChange}>
                        <Radio.Button value="tag">Tag</Radio.Button>
                        <Radio.Button value="title">Title</Radio.Button>
                    </Radio.Group>
                    <TagSearchBar onSearch={this.handleTagSearch} />
                    <div className="home-content">
                        <BookCarousel />
                        <BookList books={this.state.books} />
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default HomeView;
