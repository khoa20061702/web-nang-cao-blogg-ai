/**
 * Integration Tests: Auth REST API (/api/auth)
 * Dùng supertest để test HTTP endpoints Express trực tiếp.
 * Dùng mongodb-memory-server để test không cần kết nối MongoDB thật.
 */
import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// We import the app only after setting up env & db
process.env.JWT_SECRET = 'test_jwt_secret_key_2026';
process.env.NODE_ENV = 'test';

import { User } from '../models/User.ts';

// Minimal Express app for integration testing (without Vite middleware)
import express from 'express';
import { authRoutes } from './authRoutes.ts';

const testApp = express();
testApp.use(express.json());
testApp.use('/api/auth', authRoutes);

let mongod: MongoMemoryServer;

describe('Auth API Integration Tests', () => {
  before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('[Test] MongoDB in-memory đã sẵn sàng.');
  });

  after(async () => {
    await mongoose.disconnect();
    await mongod.stop();
    console.log('[Test] Đã dừng MongoDB in-memory.');
  });

  // ===========================
  // TEST: POST /api/auth/register
  // ===========================
  describe('POST /api/auth/register', () => {
    beforeEach(async () => {
      // Xóa dữ liệu trước mỗi test đăng ký
      await User.deleteMany({});
    });
    it('Đăng ký tài khoản mới thành công và trả về JWT token', async () => {
      const res = await request(testApp)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@phenikaa.edu.vn',
          password: 'password123',
          fullName: 'Nguyễn Kiểm Thử',
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.token, 'Phải có JWT token trong response');
      assert.equal(res.body.data.user.email, 'test@phenikaa.edu.vn');
      assert.equal(res.body.data.user.role, 'student', 'Default role phải là student');
    });

    it('Từ chối đăng ký khi thiếu trường bắt buộc (email)', async () => {
      const res = await request(testApp)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          password: 'pass123',
          fullName: 'Nguyễn Thiếu Email',
          // email bị bỏ trống
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.equal(res.body.code, 'VALIDATION_ERROR');
    });

    it('Từ chối đăng ký khi mật khẩu quá ngắn (< 6 ký tự)', async () => {
      const res = await request(testApp)
        .post('/api/auth/register')
        .send({
          username: 'shortpass',
          email: 'short@phenikaa.edu.vn',
          password: '123',
          fullName: 'Mật Khẩu Ngắn',
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.code, 'WEAK_PASSWORD');
    });

    it('Từ chối đăng ký email trùng lặp', async () => {
      await request(testApp)
        .post('/api/auth/register')
        .send({
          username: 'user1',
          email: 'duplicate@phenikaa.edu.vn',
          password: 'password123',
          fullName: 'User One',
        });

      const res = await request(testApp)
        .post('/api/auth/register')
        .send({
          username: 'user2',
          email: 'duplicate@phenikaa.edu.vn',
          password: 'password456',
          fullName: 'User Two',
        });

      assert.equal(res.status, 409);
      assert.equal(res.body.code, 'USER_EXISTS');
    });
  });

  // ===========================
  // TEST: POST /api/auth/login
  // ===========================
  describe('POST /api/auth/login', () => {
    before(async () => {
      // Seed một tài khoản test
      await request(testApp)
        .post('/api/auth/register')
        .send({
          username: 'logintest',
          email: 'login@phenikaa.edu.vn',
          password: 'correctpassword',
          fullName: 'Test Login User',
        });
    });

    it('Đăng nhập thành công với username và password đúng', async () => {
      const res = await request(testApp)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'logintest',
          password: 'correctpassword',
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.token, 'Phải có JWT token');
      assert.equal(res.body.data.user.username, 'logintest');
    });

    it('Đăng nhập thành công với email thay vì username', async () => {
      const res = await request(testApp)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'login@phenikaa.edu.vn',
          password: 'correctpassword',
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
    });

    it('Trả về 401 khi sai mật khẩu', async () => {
      const res = await request(testApp)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'logintest',
          password: 'wrongpassword',
        });

      assert.equal(res.status, 401);
      assert.equal(res.body.code, 'INVALID_CREDENTIALS');
    });

    it('Trả về 401 khi tài khoản không tồn tại', async () => {
      const res = await request(testApp)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'khongtontai',
          password: 'anypassword',
        });

      assert.equal(res.status, 401);
      assert.equal(res.body.code, 'INVALID_CREDENTIALS');
    });
  });

  // ===========================
  // TEST: GET /api/auth/me
  // ===========================
  describe('GET /api/auth/me', () => {
    let validToken: string;

    before(async () => {
      const regRes = await request(testApp)
        .post('/api/auth/register')
        .send({
          username: 'meuser',
          email: 'me@phenikaa.edu.vn',
          password: 'password123',
          fullName: 'Me User Test',
        });
      validToken = regRes.body.data.token;
    });

    it('Trả về thông tin profile khi có token hợp lệ', async () => {
      const res = await request(testApp)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.email, 'me@phenikaa.edu.vn');
    });

    it('Trả về 401 khi không có token (chưa đăng nhập)', async () => {
      const res = await request(testApp)
        .get('/api/auth/me');

      assert.equal(res.status, 401);
      assert.equal(res.body.code, 'UNAUTHORIZED');
    });

    it('Trả về 401 khi token giả mạo / hết hạn', async () => {
      const res = await request(testApp)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer this.is.a.fake.token');

      assert.equal(res.status, 401);
      assert.equal(res.body.code, 'TOKEN_INVALID');
    });
  });
});
