import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
  gql,
} from '@apollo/client';
import { useState } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import Header from './Header.jsx';

// Apollo Client kurulumu
const client = new ApolloClient({
  uri: 'http://localhost:4001/graphql',
  cache: new InMemoryCache(),
});

// GraphQL Sorguları
const GET_COMPANIES = gql`
  query GetCompanies {
    getCompanies {
      id
      name
      averageRating
    }
  }
`;

const GET_REVIEWS = gql`
  query GetReviews($companyId: ID!) {
    getReviews(companyId: $companyId) {
      content
      rating
      author {
        name
      }
    }
  }
`;

const ADD_REVIEW = gql`
  mutation AddReview($companyId: ID!, $content: String!, $rating: Int!) {
    addReview(companyId: $companyId, content: $content, rating: $rating) {
      id
      content
      rating
    }
  }
`;

// Şirketler Bileşeni
const Companies = ({ selectCompany }) => {
  const { loading, error, data } = useQuery(GET_COMPANIES);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error.message}</p>;

  return (
    <>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Şirketler</h2>
        <ul>
          {data.getCompanies.map((company) => (
            <li
              key={company.id}
              className="cursor-pointer p-2 border-b hover:bg-gray-100"
              onClick={() => selectCompany(company.id)}
            >
              {company.name} - Ortalama Puan: {company.averageRating}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

Companies.propTypes = {
  selectCompany: PropTypes.func.isRequired,
};

// Yorumlar Bileşeni
const Reviews = ({ companyId }) => {
  const { loading, error, data } = useQuery(GET_REVIEWS, {
    variables: { companyId },
  });

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error.message}</p>;

  return (
    <>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Yorumlar</h2>
        <ul>
          {data.getReviews.map((review) => (
            <li key={review.id} className="p-2 border-b">
              <p className="font-semibold">{review.author.name}:</p>
              <p>{review.content}</p>
              <p className="text-sm text-gray-500">Puan: {review.rating}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

Reviews.propTypes = {
  companyId: PropTypes.string.isRequired,
};

// Yorum Ekleme Bileşeni
const AddReview = ({ companyId }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [addReview] = useMutation(ADD_REVIEW);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview({
        variables: { companyId, content, rating: parseInt(rating) },
        context: {
          headers: {
            Authorization: `Bearer YOUR_JWT_TOKEN`, // Buraya JWT token ekle
          },
        },
      });
      alert('Yorum eklendi!');
      setContent('');
      setRating(5);
    } catch (err) {
      alert(`Hata: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md mt-4">
      <h3 className="text-lg font-bold mb-2">Yorum Ekle</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Yorumunuzu yazın..."
        className="w-full p-2 border rounded mb-2"
        required
      ></textarea>
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        min="1"
        max="5"
        className="w-full p-2 border rounded mb-2"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        Yorum Gönder
      </button>
    </form>
  );
};

AddReview.propTypes = {
  companyId: PropTypes.string.isRequired,
};

// Ana Uygulama Bileşeni
export default function App() {
  const [selectedCompany, setSelectedCompany] = useState(null);

  return (
    <>
      <Header></Header>
      <ApolloProvider client={client}>
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold text-center mb-4">
            Staj Değerlendirme Platformu
          </h1>
          <Companies selectCompany={setSelectedCompany} />
          {selectedCompany && (
            <>
              <Reviews companyId={selectedCompany} />
              <AddReview companyId={selectedCompany} />
            </>
          )}
        </div>
      </ApolloProvider>
    </>
  );
}
