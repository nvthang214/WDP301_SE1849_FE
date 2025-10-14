import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CompanyService } from "../../../services/CompanyService";
import ROUTER from "../../../router/ROUTER";

const CompanyList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Error boundary cho component
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchCompanies}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching companies...");
      const response = await CompanyService.getCompanies();
      console.log("Companies response:", response);
      
      // Xử lý response từ backend - response đã là data từ axios interceptor
      if (response && response.data && response.data.companies) {
        setCompanies(response.data.companies);
      } else if (response && response.companies) {
        setCompanies(response.companies);
      } else if (Array.isArray(response)) {
        setCompanies(response);
      } else {
        console.log("No companies found, setting empty array");
        setCompanies([]);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      console.error("Error details:", error.response?.data || error.message);
      setError(`Không thể tải danh sách công ty: ${error.response?.data?.msg || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (companyId) => {
    navigate(`${ROUTER.COMPANY_EDIT.replace(':id', companyId)}`);
  };

  const handleCreateNew = () => {
    navigate(ROUTER.COMPANY_POST);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản Lý Công Ty</h1>
              <p className="text-gray-600 mt-1">Danh sách các công ty bạn đã tạo</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Tạo Công Ty Mới</span>
            </button>
          </div>
        </div>

        {/* Company List */}
        <div className="bg-white rounded-lg shadow-sm">
          {companies.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có công ty nào</h3>
              <p className="text-gray-600 mb-4">Bạn chưa tạo công ty nào. Hãy tạo công ty đầu tiên của bạn!</p>
              <button
                onClick={handleCreateNew}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Tạo Công Ty Đầu Tiên
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {companies.map((company) => (
                <div key={company._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Company Logo */}
                      <div className="flex-shrink-0">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Company Info */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                        <p className="text-sm text-gray-600">
                          {company.industry && `${company.industry} • `}
                          {company.teamSize && `Quy mô: ${company.teamSize} người`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Tạo lúc: {company.createdAt ? new Date(company.createdAt).toLocaleDateString('vi-VN') : 'Không xác định'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <button
                      onClick={() => handleUpdate(company._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Cập Nhật</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
