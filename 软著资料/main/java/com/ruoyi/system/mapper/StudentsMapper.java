package com.ruoyi.system.mapper;

import java.util.List;
import com.ruoyi.system.domain.Students;

/**
 * 学生Mapper接口
 * 
 * @author ruoyi
 * @date 2023-08-25
 */
public interface StudentsMapper 
{
    /**
     * 查询学生
     * 
     * @param studentId 学生主键
     * @return 学生
     */
    public Students selectStudentsByStudentId(Long studentId);

    /**
     * 查询学生列表
     * 
     * @param students 学生
     * @return 学生集合
     */
    public List<Students> selectStudentsList(Students students);

    /**
     * 新增学生
     * 
     * @param students 学生
     * @return 结果
     */
    public int insertStudents(Students students);

    /**
     * 修改学生
     * 
     * @param students 学生
     * @return 结果
     */
    public int updateStudents(Students students);

    /**
     * 删除学生
     * 
     * @param studentId 学生主键
     * @return 结果
     */
    public int deleteStudentsByStudentId(Long studentId);

    /**
     * 批量删除学生
     * 
     * @param studentIds 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteStudentsByStudentIds(Long[] studentIds);
}
